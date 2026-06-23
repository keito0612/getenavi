---
name: react-best-practices
description: Reactのベストプラクティスガイド。コンポーネント設計、フック、パフォーマンス最適化、テスト、状態管理をカバー。Reactコンポーネントの構築、リファクタリング、レビュー時に使用。
when_to_use: React開発、コンポーネントレビュー、アーキテクチャ議論、パフォーマンス問題、テスト戦略
---

# React ベストプラクティス

## コンポーネント設計

### 基本原則
- 関数コンポーネント + Hooksを使用（クラスコンポーネントは非推奨）
- 単一責任の原則：1コンポーネント = 1つの役割
- 継承よりコンポジションを優先
- TypeScriptで型安全性を確保
- propsは関数パラメータで分割代入

### Props型定義のルール

#### ローカルコンポーネント（ファイル内でのみ使用）
インライン型注釈を使用：
```tsx
function UserCard({ name, email }: { name: string; email: string }) {
  return (
    <div>
      <h3>{name}</h3>
      <p>{email}</p>
    </div>
  );
}
```

#### エクスポートするコンポーネント（再利用可能）
type定義を使用：
```tsx
type ButtonProps = {
  label: string;
  onClick: () => void;
  variant?: "primary" | "secondary";
};

export function Button({ label, onClick, variant = "primary" }: ButtonProps) {
  return (
    <button className={`btn btn-${variant}`} onClick={onClick}>
      {label}
    </button>
  );
}
```

### 悪い例
```tsx
// props型定義なし、anyを使用
export function Button(props: any) {
  return <button onClick={props.onClick}>{props.label}</button>;
}

// ローカルコンポーネントなのに不要なtype定義
type CardProps = { title: string };  // 不要
function Card({ title }: CardProps) {
  return <div>{title}</div>;
}
```

## Hooks

### 基本ルール
- Hooksは常にトップレベルで呼び出す（条件分岐やループ内で呼ばない）
- カスタムHooksは`use`で始める

### 各Hookの使い分け
| Hook | 用途 |
|------|------|
| `useState` | ローカルステート |
| `useEffect` | 副作用（API呼び出し、購読など） |
| `useCallback` | コールバック関数のメモ化 |
| `useMemo` | 計算結果のメモ化 |
| `useContext` | コンテキストの利用 |
| `useReducer` | 複雑なステート管理 |
| `useRef` | DOM参照、再レンダリング不要な値 |

### useEffect の依存配列
```tsx
// 良い例：依存配列を正しく指定
useEffect(() => {
  fetchData(userId);
}, [userId]);

// 悪い例：依存配列なし（無限ループの危険）
useEffect(() => {
  fetchData(userId);
});
```

### クリーンアップ
```tsx
useEffect(() => {
  const subscription = subscribeToData();
  return () => {
    subscription.unsubscribe(); // クリーンアップ必須
  };
}, []);
```

## パフォーマンス最適化

### メモ化
```tsx
// コンポーネントのメモ化
const MemoizedComponent = React.memo(ExpensiveComponent);

// コールバックのメモ化
const handleClick = useCallback(() => {
  doSomething(id);
}, [id]);

// 計算結果のメモ化
const sortedItems = useMemo(() => {
  return items.sort((a, b) => a.name.localeCompare(b.name));
}, [items]);
```

### コード分割
```tsx
// React.lazyによる遅延読み込み
const HeavyComponent = React.lazy(() => import("./HeavyComponent"));

function App() {
  return (
    <Suspense fallback={<Loading />}>
      <HeavyComponent />
    </Suspense>
  );
}
```

### 避けるべきパターン
```tsx
// 悪い例：レンダリング毎に新しいオブジェクト生成
<Component style={{ color: "red" }} />

// 良い例：オブジェクトを外に出す
const style = { color: "red" };
<Component style={style} />
```

## 状態管理

### 状態の設計原則
1. **必要最小限の状態**：派生できる値は状態にしない
2. **状態は低く保つ**：必要なコンポーネントの近くに配置
3. **単一の情報源**：同じデータを複数箇所で管理しない

### 状態管理の選択
| 規模 | 推奨 |
|------|------|
| 小規模 | useState |
| 中規模 | useContext + useReducer |
| 大規模 | Zustand, Jotai, Redux |

## ファイル構成

```
src/
├── components/
│   ├── features/        # 機能別コンポーネント
│   │   ├── Auth/
│   │   └── Restaurant/
│   └── common/          # 共通コンポーネント
│       ├── Button/
│       └── Modal/
├── hooks/               # カスタムHooks
├── contexts/            # Contextプロバイダー
├── services/            # API呼び出し
├── types/               # 型定義
└── utils/               # ユーティリティ関数
```

## アンチパターン

### 避けるべきこと
1. **条件付きHook呼び出し**
2. **useEffectの依存配列省略**
3. **インラインオブジェクト/関数の乱用**
4. **派生値をstateに保存**
5. **useEffectでのクリーンアップ忘れ**
6. **リストのkeyにindexを使用**（静的リスト以外）
7. **不要なuseEffect**

### 不要なuseEffectの例
```tsx
// 悪い例：派生値をuseEffectで計算
const [items, setItems] = useState([]);
const [filteredItems, setFilteredItems] = useState([]);

useEffect(() => {
  setFilteredItems(items.filter(item => item.active));
}, [items]);

// 良い例：レンダリング時に直接計算
const [items, setItems] = useState([]);
const filteredItems = items.filter(item => item.active);
```

## テスト

### React Testing Library
```tsx
import { render, screen, fireEvent } from "@testing-library/react";

test("ボタンクリックでカウントが増加する", () => {
  render(<Counter />);

  const button = screen.getByRole("button", { name: /increment/i });
  fireEvent.click(button);

  expect(screen.getByText("Count: 1")).toBeInTheDocument();
});
```

### テストの原則
- 実装ではなく振る舞いをテスト
- ユーザー視点でテスト
- アクセシビリティを意識したセレクタを使用
