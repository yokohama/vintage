/**
 * エラーハンドリングのためのユーティリティ関数
 * Next.js v14のエラーバウンダリと連携するために使用
 */

/**
 * エラーをスローのユーティリティ関数
 * @param error エラーオブジェクトまたはエラーメッセージ
 * @param defaultMessage デフォルトのエラーメッセージ
 */
export function throwError(
  error: unknown,
  defaultMessage: string = "エラーが発生しました",
): never {
  throw error instanceof Error
    ? error
    : new globalThis.Error(typeof error === "string" ? error : defaultMessage);
}

/**
 * APIレスポンスからエラーを抽出するユーティリティ関数
 *
 * @param response APIレスポンス
 * @param defaultMessage デフォルトのエラーメッセージ
 */

// 以下は、ApiErrorTypeと合わせて、統合していく
// export function extractErrorFromResponse(
//   response: { error: unknown } | null | undefined,
//   defaultMessage: string = "APIエラーが発生しました"
// ): Error | null {
//   if (!response || !response.error) return null;
//
//   return response.error instanceof Error
//     ? response.error
//     : new globalThis.Error(
//         typeof response.error === "string"
//           ? response.error
//           : defaultMessage
//       );
// }
