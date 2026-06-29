---
name: frontend-design
description: フロントエンドデザインのベストプラクティスガイド。レイアウト、タイポグラフィ、カラー、レスポンシブデザイン、アクセシビリティをカバー。UI実装、デザインレビュー、スタイリング時に使用。
when_to_use: UI実装、デザイン改善、レスポンシブ対応、アクセシビリティ改善、Tailwind CSS
---

# フロントエンドデザイン ベストプラクティス

## レイアウト

### Flexbox vs Grid
| 用途 | 推奨 |
|------|------|
| 1次元レイアウト（行または列） | Flexbox |
| 2次元レイアウト（行と列） | Grid |
| 中央揃え | Flexbox |
| カードグリッド | Grid |
| ナビゲーション | Flexbox |

### Tailwind レイアウトパターン
```tsx
// 中央揃え
<div className="flex items-center justify-center">

// 両端揃え
<div className="flex items-center justify-between">

// カードグリッド（レスポンシブ）
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">

// スタック（縦並び）
<div className="flex flex-col gap-4">
```

## スペーシング

### 8pxグリッドシステム
一貫したスペーシングのために8の倍数を使用：
- `gap-1` = 4px
- `gap-2` = 8px
- `gap-3` = 12px
- `gap-4` = 16px
- `gap-6` = 24px
- `gap-8` = 32px

### スペーシングの原則
1. **関連する要素は近く**：同じグループの要素は小さいgap
2. **異なるグループは遠く**：セクション間は大きいgap
3. **一貫性を保つ**：同じ種類の要素には同じスペーシング

```tsx
// 良い例：一貫したスペーシング
<div className="space-y-6">           {/* セクション間 */}
  <section className="space-y-4">     {/* グループ間 */}
    <h2>Title</h2>
    <div className="space-y-2">       {/* 要素間 */}
      <p>Content 1</p>
      <p>Content 2</p>
    </div>
  </section>
</div>
```

## タイポグラフィ

### フォントサイズの階層
```tsx
// 見出し
<h1 className="text-2xl font-bold">   // 24px
<h2 className="text-xl font-semibold"> // 20px
<h3 className="text-lg font-medium">   // 18px

// 本文
<p className="text-base">              // 16px（デフォルト）
<p className="text-sm text-gray-600">  // 14px（補足テキスト）
<p className="text-xs text-gray-500">  // 12px（注釈）
```

### 読みやすさの原則
- **行の長さ**：最大65-75文字（`max-w-prose`）
- **行間**：本文は`leading-relaxed`（1.625）
- **コントラスト**：本文は`gray-700`以上

## カラー

### カラーパレットの原則
```tsx
// プライマリカラー（ブランド）
className="bg-amber-600 text-white"

// セカンダリカラー（補助）
className="bg-gray-100 text-gray-700"

// 成功
className="bg-green-500 text-white"
className="text-green-600"

// エラー
className="bg-red-500 text-white"
className="text-red-600"

// 警告
className="bg-yellow-500 text-black"
className="text-yellow-600"
```

### 背景色の階層
```tsx
// 最背面（ページ全体）
className="bg-gray-50"

// カード・コンテナ
className="bg-white"

// ホバー状態
className="hover:bg-gray-100"

// アクティブ・選択状態
className="bg-amber-50"
```

## レスポンシブデザイン

### ブレイクポイント
| プレフィックス | 最小幅 | 対象デバイス |
|--------------|--------|-------------|
| （なし） | 0px | モバイル（デフォルト） |
| `sm:` | 640px | 大きめスマホ |
| `md:` | 768px | タブレット |
| `lg:` | 1024px | ノートPC |
| `xl:` | 1280px | デスクトップ |

### モバイルファースト
```tsx
// モバイルファーストで記述
<div className="
  p-4            // モバイル: padding 16px
  md:p-6         // タブレット: padding 24px
  lg:p-8         // デスクトップ: padding 32px
">

// レスポンシブ表示切り替え
<div className="block md:hidden">モバイルのみ</div>
<div className="hidden md:block">タブレット以上</div>
```

### タッチターゲット
- 最小サイズ：44x44px
- ボタン：`min-h-[44px] px-4`
- リンク：十分なパディング

## アクセシビリティ

### 必須事項
```tsx
// 画像には必ずalt
<img src="..." alt="店舗の外観写真" />

// アイコンボタンにはaria-label
<button aria-label="閉じる">
  <XIcon />
</button>

// フォームにはlabel
<label htmlFor="email">メールアドレス</label>
<input id="email" type="email" />
```

### フォーカス表示
```tsx
// フォーカスリングを必ず表示
className="focus:outline-none focus:ring-2 focus:ring-amber-500"

// キーボードナビゲーション対応
className="focus-visible:ring-2 focus-visible:ring-amber-500"
```

### カラーコントラスト
- 通常テキスト：4.5:1以上
- 大きいテキスト：3:1以上
- `text-gray-500`以下は避ける（コントラスト不足）

## コンポーネントパターン

### ボタン
```tsx
// プライマリボタン
className="
  bg-amber-600 text-white
  hover:bg-amber-700
  active:bg-amber-800
  disabled:bg-gray-300 disabled:cursor-not-allowed
  px-4 py-2 rounded-md font-medium
  transition-colors
"

// セカンダリボタン
className="
  bg-white text-gray-700 border border-gray-300
  hover:bg-gray-50
  px-4 py-2 rounded-md font-medium
"

// ゴーストボタン
className="
  text-amber-600
  hover:bg-amber-50
  px-4 py-2 rounded-md font-medium
"
```

### カード
```tsx
className="
  bg-white
  rounded-lg
  shadow-sm
  border border-gray-200
  p-4
  hover:shadow-md
  transition-shadow
"
```

### インプット
```tsx
className="
  w-full
  px-3 py-2
  border border-gray-300 rounded-md
  focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent
  placeholder:text-gray-400
"
```

## アニメーション

### トランジション
```tsx
// 色の変化
className="transition-colors duration-200"

// 全般的な変化
className="transition-all duration-200"

// ホバーエフェクト
className="transition-transform hover:scale-105"
```

### 推奨するイージング
- `ease-out`: 要素の出現
- `ease-in`: 要素の消失
- `ease-in-out`: 移動アニメーション

### パフォーマンス
- `transform`と`opacity`のみアニメーション（GPUアクセラレーション）
- `width`、`height`、`margin`のアニメーションは避ける

## アンチパターン

### 避けるべきこと
1. **インラインスタイルの乱用**：Tailwindクラスを使用
2. **マジックナンバー**：`w-[347px]`より`w-full max-w-sm`
3. **!important の乱用**：クラスの順序で解決
4. **深いネスト**：最大3階層まで
5. **重複したスタイル定義**：コンポーネント化する

### 良い例と悪い例
```tsx
// 悪い例：マジックナンバー
<div className="w-[347px] h-[52px] mt-[13px]">

// 良い例：セマンティックな値
<div className="w-full max-w-sm h-14 mt-3">

// 悪い例：重複
<button className="bg-amber-600 text-white px-4 py-2 rounded">Button 1</button>
<button className="bg-amber-600 text-white px-4 py-2 rounded">Button 2</button>

// 良い例：コンポーネント化
<Button>Button 1</Button>
<Button>Button 2</Button>
```
