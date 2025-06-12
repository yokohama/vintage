# アプリ全体のエラーハンドリングを統一させる。

## STEP1 (close)
- appの下では、components/ui/NotFound.tsx及び、Erro.tsxを使用している。これは、nextjsの標準で用意されている設計に反していないか？
- どのような設計が標準で用意されているか調査する。

### 調査結果
#### 現状の問題点

現在のプロジェクトでは、エラーハンドリングに以下のコンポーネントを使用しています：

1. `components/ui/NotFound.tsx` - 404エラー用のUIコンポーネント
2. `components/ui/Error.tsx` - 一般的なエラー用のUIコンポーネント

これらのコンポーネントは、Next.js v14の標準的なエラーハンドリング方法と異なる実装になっています。

#### Next.js v14の標準的なエラーハンドリング方法

Next.js v14では、App Routerを使用する場合、以下の特殊なファイルを使ってエラーハンドリングを行います：

1. **error.js/tsx** - 予期しないエラーをキャッチするためのエラーバウンダリ
   - 各ルートセグメントに配置可能
   - クライアントコンポーネントである必要がある（'use client'ディレクティブが必要）
   - エラーメッセージとリセット機能を提供

2. **not-found.js/tsx** - 404エラー（リソースが見つからない場合）のUI
   - `notFound()`関数と組み合わせて使用
   - ルートの`app/not-found.js`は、アプリ全体の未マッチURLを処理

3. **global-error.js/tsx** - ルートレイアウトでのエラーをキャッチ
   - 独自の`<html>`と`<body>`タグを定義する必要がある

#### 標準設計との比較

現在の実装は、Next.jsの標準設計と以下の点で異なります：

1. **コンポーネントベースのアプローチ vs ファイルベースのアプローチ**
   - 現在：再利用可能なコンポーネント（`NotFound.tsx`、`Error.tsx`）を使用
   - 標準：特殊なファイル（`error.js`、`not-found.js`）を各ルートセグメントに配置

2. **エラーバウンダリの実装**
   - 現在：明示的なエラーバウンダリの実装がない
   - 標準：`error.js`がReactのエラーバウンダリとして機能

3. **404処理**
   - 現在：手動で`NotFound`コンポーネントをレンダリング
   - 標準：`notFound()`関数を呼び出し、対応する`not-found.js`ファイルが自動的にレンダリングされる

#### 推奨される改善策

Next.js v14の標準に合わせるためには、以下の変更が必要です：

1. **ルートレベルのエラーハンドリングファイルの追加**
   - `app/error.tsx` - アプリ全体のエラーバウンダリ
   - `app/not-found.tsx` - グローバルな404ページ
   - `app/global-error.tsx` - ルートレイアウトのエラー用（必要に応じて）

2. **各ルートセグメントに特定のエラーハンドリングを追加**
   - 必要に応じて、各ルートフォルダに`error.tsx`と`not-found.tsx`を追加

3. **`notFound()`関数の使用**
   - リソースが見つからない場合に`notFound()`関数を呼び出す

4. **既存のコンポーネントの移行**
   - 既存の`NotFound`と`Error`コンポーネントのスタイルと機能を新しいファイルに移行

## STEP2 (close)
- 上記の調査結果をもとに、
- app/checkpointsの下を標準の実装で実装する。
- 現在checkpointsの下では、ErrorもNotFoundも使用していないので、新規作成になる。

## STEP3 (close)
- STEP2の実装を参考にして、
- app/brands/page.tsxも同様に実装する。
- app/brands/[brandId]以下は対象外。
- app/brands/page.tsxでは、brandsAPI.tsを使用しているので、notfound()や、throwErrorなど必要かつ適切なのであればであれば、brandsAPIに実装する。

## STEP4 (close)
- 今までの実装を参考にして、
- app/brands/[brandId]/products/[productId]/page.tsxも同様に実装する。

## STEP5 (current open)
- 今までの実装を参考にして、以下も同様の設計で実装。
./app/likes/page.tsx

## STEP6 (next)
- 今までの実装を参考にして、以下も同様の設計で実装。
./app/brands/[brandId]/products/page.tsx

## STEP7 (next)
- 今までの実装を参考にして、以下も同様の設計で実装。
./app/profiles/[id]/page.tsx

## STEP7 (next)
- 今までの実装を参考にして、以下も同様の設計で実装。
./app/auth/callback/page.tsx
