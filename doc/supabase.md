# Supabase データモデル設計

このドキュメントでは、`lib/api/supabase`フォルダ内のファイルに基づいて、各モデルの関連と設計について説明します。

## モデル構造と関連

### データモデル概要

```
Brand
 └── Product (belongs_to Brand)
      └── Vintage (belongs_to Product)
           └── CheckPoint (belongs_to Vintage, belongs_to Profile)
                └── CheckPointLike (belongs_to CheckPoint, belongs_to Profile)

Profile
 └── CheckPoint (belongs_to Profile)
 └── CheckPointLike (belongs_to Profile)
```

## 命名規則

- **belongs_to関係**: 単数形で命名（例: `brand`, `product`, `vintage`, `profile`）
- **has_many関係**: 複数形で命名（例: `products`, `vintages`, `checkPoints`, `checkPointLikes`）

## 循環参照の回避

循環参照を避けるため、以下の設計原則を採用しています：

1. 親モデルが子モデルを参照する場合（has_many関係）：
   - クエリで子モデルを取得し、親モデルのプロパティとして保持する
   - 例: `Brand.products`, `Product.vintages`, `Vintage.checkPoints`

2. 子モデルが親モデルを参照する場合（belongs_to関係）：
   - 親モデルのhas_many関係は空配列`[]`として初期化する
   - 例: `Product.brand.products = []`, `Vintage.product.vintages = []`

## モデル詳細

### 1. Brand（ブランド）

**型定義**:
- Supabase型: `SupabaseBrandType`
- アプリケーション型: `BrandType`

**関連**:
- has_many: `products` (Product)

**マッピング関数**: `mapBrand`

### 2. Product（製品）

**型定義**:
- Supabase型: `SupabaseProductType`
- アプリケーション型: `ProductType`

**関連**:
- belongs_to: `brand` (Brand)
- has_many: `vintages` (Vintage)

**マッピング関数**: `mapProduct`

### 3. Vintage（ヴィンテージ）

**型定義**:
- Supabase型: `SupabaseVintageType`
- アプリケーション型: `VintageType`

**関連**:
- belongs_to: `product` (Product)
- has_many: `checkPoints` (CheckPoint)

**マッピング関数**: `mapVintage`

### 4. CheckPoint（チェックポイント）

**型定義**:
- Supabase型: `SupabaseCheckPointType`
- アプリケーション型: `CheckPointType`

**関連**:
- belongs_to: `vintage` (Vintage)
- belongs_to: `profile` (Profile)
- has_many: (暗黙的) `checkPointLikes` (CheckPointLike) - いいね数としてカウント

**マッピング関数**: `mapCheckPoint`

### 5. Profile（ユーザープロファイル）

**型定義**:
- Supabase型: `SupabaseProfileType`
- アプリケーション型: `UserProfileType`

**関連**:
- has_many: `checkPointLikes` (CheckPointLike)

**マッピング関数**: `mapProfile`

### 6. CheckPointLike（いいね）

**型定義**:
- Supabase型: `SupabaseCheckPointLikeType`
- アプリケーション型: 直接的な型はなく、`CheckPointType`の拡張として扱われる

**関連**:
- belongs_to: `profile` (Profile)
- belongs_to: `checkPoint` (CheckPoint)

**マッピング関数**: `mapCheckPointLike`

## データ変換（マッピング）

各モデルはSupabaseから取得したデータ（スネークケース）をアプリケーションで使用する形式（キャメルケース）に変換するマッピング関数を持っています：

1. `mapBrand`: SupabaseBrandType → BrandType
2. `mapProduct`: SupabaseProductType → ProductType
3. `mapVintage`: SupabaseVintageType → VintageType
4. `mapCheckPoint`: SupabaseCheckPointType → CheckPointType
5. `mapProfile`: SupabaseProfileType → UserProfileType
6. `mapCheckPointLike`: SupabaseCheckPointLikeType → CheckPointType

## lib/types.ts との関係

`lib/types.ts`はアプリケーション全体で使用される型定義を提供しています。一方、`lib/api/supabase/utils/types.ts`はSupabaseから返されるデータの型定義を提供しています。

主な違い：
1. **命名規則**:
   - `lib/types.ts`: キャメルケース（例: `imageUrl`, `brandId`）
   - `lib/api/supabase/utils/types.ts`: スネークケース（例: `image_url`, `brand_id`）

2. **型の用途**:
   - `lib/types.ts`: アプリケーション全体で使用される型（コンポーネント、ページなど）
   - `lib/api/supabase/utils/types.ts`: Supabaseとの通信に特化した型

3. **変換プロセス**:
   - Supabaseから取得したデータ（`SupabaseXXXType`）は、マッピング関数を通じてアプリケーション型（`XXXType`）に変換される
   - この変換は主に`formatHelper.ts`内の各`mapXXX`関数で行われる

## エラーハンドリング

Supabaseとの通信におけるエラーハンドリングは、以下の関数で統一的に処理されています：

1. `handleSupabaseError`: Supabaseから返されたエラーを処理
2. `handleNotFoundError`: データが見つからない場合のエラーを処理
3. `processSupabaseResponse`: 単一レスポンスの処理と変換
4. `processSupabaseArrayResponse`: 配列レスポンスの処理と変換

## API クラス

各モデルに対応するAPIクラスが提供されています：

1. `brandsAPI`: ブランド関連のAPI操作
2. `productsAPI`: 製品関連のAPI操作
3. `vintageAPI`: ヴィンテージ関連のAPI操作
4. `checkPointsAPI`: チェックポイント関連のAPI操作
5. `userProfilesAPI`: ユーザープロファイル関連のAPI操作

これらのクラスは、Supabaseとの通信を抽象化し、アプリケーションに必要なデータを取得・更新するためのメソッドを提供します。
