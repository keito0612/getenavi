# ゲテモノ・珍食飲食店検索サービス（ゲテナビ）開発仕様書
# For Claude Code / AI Coder Context

## 1. プロジェクト概要・背景・ターゲット

### 1.1 背景 (Background)
既存の巨大グルメプラットフォーム（食べログ、Google マップ等）は一般的なカテゴリー（居酒屋、ラーメン等）に最適化されており、「ワニ肉」「昆虫食」「ヘビ」といったマイナー・エキゾチック食材を専門に扱う店舗やメニューが極めて検索しづらい。
本システムは、これらの情報の非対称性を解消し、エッジファーストなモダンスタックを用いることで、低レイテンシかつ低運用コストで「今すぐ行ける珍食店」を提供する特化型マッププラットフォームである。

### 1.2 ターゲットユーザー (Target User)
1. **コアユーザー:** 新しい食体験やマイナー食材の開拓に無上の喜びを感じる珍食・ゲテモノマニア層。
2. **ミドルユーザー:** サークルや会社の飲み会で「記憶に残る面白いイベント」を企画したい幹事層。
3. **ライトユーザー:** SNS等を見て「人生で一度くらいは話のネタにワニや昆虫を食べてみたい」と考える一般チャレンジャー層。

---

## 2. システムアーキテクチャ ＆ 技術スタック

### 2.1 技術選定
- **フロントエンド ＆ バックエンドAPI:** Next.js (App Router, Route Handlers)
- **システムアーキテクチャ:** Repository Pattern, Service層（フロントエンドとバックエンドで分離。フロントは単一責任）
- **デプロイ先プラットフォーム:** Cloudflare Workers (Workers Assets & Functions 統合仕様)
- **データベース:** Turso (Distributed LibSQL / SQLiteベースのエッジ分散DB)
- **ORM:** Prisma Client (v5.x以上) + `@prisma/adapter-libsql` (Driver Adapter 必須)

### 2.2 ディレクトリ構造

```
src/
├── app/
│   ├── api/                    # Route Handlers (APIエンドポイント)
│   │   ├── restaurants/
│   │   │   └── route.ts
│   │   └── tags/
│   │       └── route.ts
│   ├── components/             # UIコンポーネント (単一責任)
│   │   ├── Map/
│   │   ├── TagFilter/
│   │   └── RestaurantDrawer/
│   ├── layout.tsx
│   └── page.tsx
├── services/                   # ビジネスロジック層
│   ├── restaurantService.ts
│   └── tagService.ts
├── repositories/               # データアクセス層 (Prisma操作)
│   ├── restaurantRepository.ts
│   └── tagRepository.ts
├── lib/                        # 共通ユーティリティ
│   ├── prisma.ts               # Prismaクライアント初期化
│   └── types.ts                # 型定義
└── prisma/
    ├── schema.prisma
    └── seed.ts
```

### 2.3 データフロー構造

```
[ Browser (Next.js CSR/SSR) ]
│
▼ (Edge Routing / HTTP)
[ Cloudflare Workers (Next.js App on Workers) ]
│
▼ (Prisma Client + @prisma/adapter-libsql via WebSocket/HTTP)
[ Turso Database (Cloud / Local sqld Container) ]
```

---

## 3. データベース物理設計 (Prisma Schema)

Laravelライクに直感的なコードが書ける「暗黙的な多対多（Implicit Many-to-Many）」を採用し、営業時間の整合性を厳格にした完全なスキーマ定義。

```prisma
datasource db {
  provider = "sqlite"
  url      = env("DATABASE_URL")
}

generator client {
  provider        = "prisma-client-js"
  previewFeatures = ["driverAdapters"]
}

// 1. 飲食店テーブル
model Restaurant {
  id          String   @id @default(uuid())
  name        String
  address     String
  latitude    Float
  longitude   Float
  url         String?
  dangerLevel Int      @map("danger_level") // 珍食レベル (1〜5)
  description String?  // 店舗紹介・目玉メニュー
  imageUrl    String?  @map("image_url")   // 店舗・料理写真URL
  createdAt   DateTime @default(now()) @map("created_at")
  updatedAt   DateTime @updatedAt @map("updated_at")

  tags          Tag[]          // 暗黙的な多対多関係
  businessHours BusinessHour[] // 一対多関係

  @@map("restaurants")
  @@index([latitude, longitude]) // マップ範囲検索高速化用
}

// 2. 食材タグテーブル
model Tag {
  id        String   @id // スラッグ識別子 (例: "wani", "hebi", "insect")
  name      String   // 表示名 (例: "ワニ", "ヘビ", "昆虫食")
  emoji     String?  // 表示用絵文字 (例: "🐊", "🐍", "🐜")
  createdAt DateTime @default(now()) @map("created_at")

  restaurants Restaurant[]

  @@map("tags")
}

// 3. 営業時間テーブル
model BusinessHour {
  id           String     @id @default(uuid())
  restaurantId String     @map("restaurant_id")
  dayOfWeek    Int        @map("day_of_week") // 0(日)〜6(土)
  openTime     String?    @map("open_time")   // "HH:MM" 形式 (定休日の場合はnull可能)
  closeTime    String?    @map("close_time")  // "HH:MM" 形式 (定休日の場合はnull可能)
  isClosed     Boolean    @default(false) @map("is_closed") // 定休日フラグ

  restaurant   Restaurant @relation(fields: [restaurantId], references: [id], onDelete: Cascade)

  @@map("business_hours")
  @@index([restaurantId, dayOfWeek])
}
```

---

## 4. UI/UX設計

### 4.1 メイン画面構成 (Single Page Interface)

**Header:**
- アプリタイトル、現在地取得ボタン

**Tag Filter Bar (上部固定・横スクロール可能):**
- Tag テーブルの全データを取得し、バッジ形式（絵文字＋名称）で並べる
- タップでON/OFFをトグル。複数選択可能
- 選択状態のタグIDをクエリパラメータとしてAPIに送りピンを動的フィルタリング

**Map Area (全画面表示):**
- フィルタリングされた店舗の latitude, longitude にマーカーピンを配置
- 珍食レベル（dangerLevel 1〜5）に応じて、ピンの色やアイコンを段階的に変更

**Detail Drawer / Modal (ピンタップで展開):**
- ピンをタップすると、画面下部からスワイプアップまたはポップアップするUI
- 表示項目: 店舗名、店舗写真（imageUrl）、珍食レベル（★の数で表現）、取扱食材タグ一覧、店舗説明文（description）
- Google風営業時間一覧: businessHours 配列を dayOfWeek (0〜6) 順に並び替え、「月曜日: 11:00〜14:30, 17:00〜22:00」のように出力。isClosed が true の曜日は明確に「定休日」として赤文字等で出力
- 外部リンクボタン: url が存在する場合、「お店の情報を詳しく見る」ボタンを表示（別タブ遷移）

**掲載リクエストリンク:**
- メニューまたは画面隅に固定。「未掲載店舗のタレコミはこちら」として外部フォーム（Googleフォーム等）に遷移

### 4.2 マップ実装仕様（無料スタック：Maplibre GL）
- **使用ライブラリ:** `maplibre-gl` および React用ラッパー `react-map-gl/maplibre`
- **地図タイル（背景データ）:** 国土地理院ベクトルタイル または OpenStreetMap（完全無料・キー不要）

---

## 5. 初期データ (Seed Data)

### 5.1 タグマスター (Tags)

| id | name | emoji |
|---|---|---|
| wani | ワニ | 🐊 |
| hebi | ヘビ | 🐍 |
| insect | 昆虫食 | 🐜 |
| ostrich | ダチョウ | 🦤 |
| gibier | ジビエ(鹿・猪) | 🐗 |

### 5.2 サンプル店舗データ

**店舗1 (新宿エリア・超弩級)**

| 項目 | 値 |
|---|---|
| name | 珍食魔宮 新宿店 |
| address | 東京都新宿区歌舞伎町1-XX-XX |
| latitude | 35.6938 |
| longitude | 139.7032 |
| dangerLevel | 5 |
| description | ヘビの生き血や、様々な昆虫の食べ比べができるマニアの聖地。 |
| 紐付けタグ | insect, hebi, wani |

**営業時間:**

| 曜日 | openTime | closeTime | isClosed |
|---|---|---|---|
| 月〜金 (1-5) | 17:00 | 23:00 | false |
| 土 (6) | 15:00 | 24:00 | false |
| 日 (0) | null | null | true (定休日) |

---

## 6. 機能一覧表（チェックリスト）

### 共通機能

| 機能ID | 機能名 | 機能概要 / 仕様詳細 | 区分 |
|---|---|---|---|
| COM-01 | レスポンシブWeb対応 | PC/スマートフォン両対応UI。スマホでのマップ操作・閲覧のUXを最優先とする。 | フロント |
| COM-02 | Edge Runtime対応 | すべてのAPIエンドポイントに `export const runtime = 'edge';` を明示する。 | バック |
| COM-03 | DB接続管理 | PrismaLibsql を用い、ローカル環境（sqld）と本番環境（Turso）を自動切り替え。 | バック |

### マップ機能

| 機能ID | 機能名 | 機能概要 / 仕様詳細 | 区分 |
|---|---|---|---|
| MAP-01 | ベースマップ描画 | 全画面にマップを描画し、初期表示時は現在地（またはデフォルト値）を中心に表示。 | フロント |
| MAP-02 | 現在地追従ボタン | Geolocation APIを用いて現在地を取得し、マップの中心を移動。 | フロント |
| MAP-03 | 店舗ピン動的配置 | APIから取得した飲食店データに基づき、マップ上にピンを配置。 | フロント |
| MAP-04 | 珍食レベル別ピン色分け | 店舗の dangerLevel（1〜5）に応じて、ピンのカラーやアイコンを段階的に変化。 | フロント |
| MAP-05 | ピンタップ連動 | ピンタップ時、画面下部からスワイプアップ等で「簡易カード」を表示。 | フロント |

### 検索・フィルタ機能

| 機能ID | 機能名 | 機能概要 / 仕様詳細 | 区分 |
|---|---|---|---|
| SRH-01 | 食材タグバッジ一覧表示 | 画面上部に、Tag マスター全件を横スクロールのバッジ形式で一覧表示。 | フロント |
| SRH-02 | タグ多重選択 | 各タグバッジをタップすることで選択/未選択の状態を切り替え（トグル）。 | フロント |
| SRH-03 | リアルタイムマップ連動 | タグの選択状態が変更された際、即座にAPIを再叩きし、マップ上のピンを動的更新。 | フロント |

### 店舗詳細機能

| 機能ID | 機能名 | 機能概要 / 仕様詳細 | 区分 |
|---|---|---|---|
| DET-01 | 店舗基本情報表示 | 簡易カードタップで展開。店舗名、写真、説明文、住所を表示。 | フロント |
| DET-02 | 取扱食材タグの可視化 | その店舗に紐づいているすべての食材タグをバッジ一覧としてレンダリング。 | フロント |
| DET-03 | 営業時間一覧生成 | 紐づく businessHours を dayOfWeek (0〜6) 順にソートし、1週間分を表示。 | フロント |
| DET-04 | 定休日スマート判定 | isClosed: true またはデータ欠落の曜日を、明確に「定休日」として赤字表示。 | フロント |
| DET-05 | 店舗公式/外部リンク遷移 | url がある場合、「お店の情報を詳しく見る」ボタンから別タブ遷移。 | フロント |

### 管理・運用機能

| 機能ID | 機能名 | 機能概要 / 仕様詳細 | 区分 |
|---|---|---|---|
| ADM-01 | 掲載リクエストリンク設置 | 画面内に「タレコミはこちら」ボタンを設置し、外部フォームURLへ遷移。 | フロント |
| ADM-02 | 初期データシードスクリプト | prisma/seed.ts 等を用意し、初期データを一括投入する仕組みを構築。 | バック |

---

## 7. 開発コマンド

```bash
# 依存関係のインストール
npm install

# 開発サーバーの起動
npm run dev

# ビルド
npm run build

# Prismaマイグレーション
npx prisma migrate dev

# シードデータ投入
npx prisma db seed
```

## 8. Docker

```bash
# コンテナのビルドと起動
docker-compose up --build

# バックグラウンドで起動
docker-compose up -d
```

## 9. ポート

- 開発サーバー: 3000
