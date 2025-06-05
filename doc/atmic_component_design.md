# アトミックコンポーネント設計によるいいね機能のリファクタリング

このドキュメントでは、アトミックデザイン原則に基づいていいね機能をリファクタリングした設計と実装について説明します。

## 1. 問題点

いいね機能は以下の問題点を抱えていました：

1. **UI実装の重複**: 複数のコンポーネントで同様のいいねボタンUIを実装
2. **いいね処理ロジックの重複**: 複数の場所でいいね追加・削除ロジックを実装
3. **データ更新処理の重複**: 親コンポーネント状態更新ロジックが複数箇所に存在
4. **いいね状態管理の重複**: 複数の場所でいいね状態を管理・更新
5. **コンポーネント実装の重複**: 類似したチェックポイントカードコンポーネントが複数存在
6. **API呼び出しの重複**: いいねAPI呼び出しが複数箇所から行われている

## 2. アトミックデザインによる解決策

アトミックデザインの原則に従い、以下のように機能を分解・再構築しました：

### 2.1 アトミックコンポーネント階層

```
Atoms（原子）
└── LikeButton（いいねボタン）: 最小単位のUIコンポーネント

Molecules（分子）
└── CheckPointFooter（チェックポイントフッター）: いいねボタンとシェアボタンを含む

Organisms（有機体）
└── CheckPoint（チェックポイントカード）: 完全なチェックポイント表示

Templates（テンプレート）
└── CheckPoints（チェックポイント一覧）: 複数のチェックポイントを表示

Pages（ページ）
└── 各種ページコンポーネント: テンプレートを使用
```

### 2.2 カスタムフック階層

```
基本フック
└── useLike: いいね機能の基本ロジック

複合フック
└── useCheckPoint: チェックポイント関連の複合ロジック（いいね機能を含む）
```

## 3. 実装詳細

### 3.1 カスタムフックの分離と責務

#### `useLike.ts`（基本フック）

```typescript
// いいね機能の基本ロジックを提供するフック
export function useLike() {
  const { userProfile } = useUserProfile();
  const [isLoading, setIsLoading] = useState(false);

  const handleLike = async (
    checkPointId: number,
    currentIsLiked: boolean,
    currentLikeCount: number = 0,
  ) => {
    // いいね追加・削除の基本ロジック
    // ...
    return {
      isLiked: newIsLiked,
      likeCount: newLikeCount,
    };
  };

  return {
    handleLike,
    isLoading,
  };
}
```

#### `useCheckPoint.ts`（複合フック）

```typescript
// チェックポイント関連の複合ロジックを提供するフック
export const useCheckPoint = ({
  checkPoint,
  setCheckPoints,
}: UseCheckPointProps) => {
  // 状態管理
  const [isLiked, setIsLiked] = useState(checkPoint.isLiked);
  const [likeCount, setLikeCount] = useState(checkPoint.likeCount || 0);
  
  // いいねの状態を更新する関数
  const updateLikeState = (newIsLiked: boolean, newLikeCount: number) => {
    setIsLiked(newIsLiked);
    setLikeCount(newLikeCount);
  };

  // その他のチェックポイント関連ロジック
  // ...

  return {
    // ...
    isLiked,
    setIsLiked,
    likeCount,
    updateLikeState,
  };
};
```

### 3.2 UIコンポーネントの分離と責務

#### `LikeButton.tsx`（Atom）

```typescript
// 最小単位のいいねボタンコンポーネント
export function LikeButton({
  checkPointId,
  isLiked,
  likeCount,
  onLikeChange,
  className = "",
  disabled = false,
}: LikeButtonProps) {
  const { handleLike, isLoading } = useLike();

  const handleLikeClick = async (e: React.MouseEvent) => {
    // いいねボタンクリック時の処理
    // ...
  };

  return (
    <button
      onClick={handleLikeClick}
      disabled={isLoading || disabled}
      className={`checkpoint-active-card-footer-sns-button ${
        isLiked ? "text-amber-700" : ""
      } ${isLoading ? "opacity-50 cursor-wait" : ""} ${className}`}
      aria-label={isLiked ? "いいねを取り消す" : "いいねする"}
    >
      <Heart
        className={
          isLiked ? "checkpoint-active-card-footer-sns-liked-heart" : ""
        }
      />
      <span className="ml-1">{likeCount}</span>
    </button>
  );
}
```

#### `CheckPointFooter.tsx`（Molecule）

```typescript
// チェックポイントフッターコンポーネント
export const CheckPointFooter = ({
  checkPoint,
  setCheckPoints,
  onLikeChange,
}: CheckPointFooterProps) => {
  const { handleShare, isLiked, likeCount, setIsLiked } = useCheckPoint({
    checkPoint,
    setCheckPoints,
  });

  return (
    <div className="checkpoint-active-card-footer-container">
      {/* プロフィール情報 */}
      <Link>...</Link>

      {/* SNSアクション */}
      <div className="checkpoint-active-card-footer-sns-container">
        {/* LikeButtonコンポーネントを使用 */}
        <LikeButton
          checkPointId={checkPoint.id}
          isLiked={isLiked || false}
          likeCount={likeCount}
          onLikeChange={(newIsLiked, newLikeCount) => {
            // いいね状態の更新処理
            // ...
          }}
        />
        <button onClick={handleShare}>...</button>
      </div>
    </div>
  );
};
```

## 4. データフロー

いいね機能のデータフローを一元化しました：

1. **ユーザーアクション**: ユーザーが`LikeButton`をクリック
2. **基本ロジック処理**: `useLike`フックの`handleLike`関数が呼び出される
3. **API通信**: `checkPointsAPI.likeCheckPoint`または`unlikeCheckPoint`が実行される
4. **状態更新**: 
   - `LikeButton`の`onLikeChange`コールバックが呼び出される
   - `CheckPointFooter`で`setIsLiked`と親コンポーネントの状態更新が行われる
   - 必要に応じて`onLikeChange`を通じて上位コンポーネントに通知

## 5. 設計原則

このリファクタリングでは以下の設計原則を適用しました：

### 5.1 単一責任の原則（SRP）
各コンポーネントとフックは明確に定義された単一の責任を持ちます：
- `LikeButton`: いいねボタンのUI表示と基本的なユーザーインタラクション
- `useLike`: いいね機能の基本ロジック（API呼び出し）
- `useCheckPoint`: チェックポイント関連の複合ロジック

### 5.2 コンポジション（合成）
小さなコンポーネントを組み合わせて複雑なUIを構築：
- `LikeButton` → `CheckPointFooter` → `CheckPoint` → `CheckPoints`

### 5.3 単方向データフロー
データは親から子へ、イベントは子から親へ流れる明確なパターン：
- Props: 親から子へデータを渡す（`isLiked`, `likeCount`など）
- コールバック: 子から親へイベントを通知（`onLikeChange`など）

### 5.4 状態の局所化
状態は可能な限り使用される場所の近くで管理：
- `useLike`: いいね処理の一時的な状態（`isLoading`）
- `useCheckPoint`: チェックポイント関連の状態（`isLiked`, `likeCount`など）

## 6. メリット

このリファクタリングによる主なメリット：

1. **コードの重複削減**: 同じロジックやUIが複数の場所に実装されることを防止
2. **保守性の向上**: 変更が必要な場合、一箇所の修正で全体に反映
3. **再利用性の向上**: 独立したコンポーネントとフックは他の場所でも容易に再利用可能
4. **テスト容易性**: 小さく独立したコンポーネントとフックはテストが容易
5. **一貫性の確保**: UIとロジックが一元化されることで、アプリケーション全体で一貫した動作を保証

## 7. 今後の拡張性

この設計は以下のような拡張に対応しやすくなっています：

1. **新しいいいね対象の追加**: 現在はチェックポイントのみですが、他のエンティティ（例：コメント）にも同じパターンで拡張可能
2. **UIのカスタマイズ**: `LikeButton`に追加のpropsを提供することで、異なる見た目や動作をサポート
3. **追加機能**: アニメーションやインタラクションの強化など、コンポーネント単位で機能追加が可能

## 8. まとめ

アトミックデザイン原則に基づくリファクタリングにより、いいね機能のコードの重複を排除し、保守性と再利用性を大幅に向上させました。この設計パターンは他の機能にも適用可能であり、アプリケーション全体のコード品質向上に貢献します。
