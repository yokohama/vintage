"use client";

import { useEffect, useRef } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { toast } from "sonner";

interface UseToastHandlerOptions {
  successMessage?: string;
  errorMessage?: string;
  successParam?: string;
  errorParam?: string;
  timeParam?: string;
}

/**
 * URLパラメータに基づいてトースト通知を表示し、表示後にパラメータを削除するカスタムフック
 * @param options トースト表示のオプション
 * @returns void
 */
export function useToastHandler({
  successMessage = "操作が完了しました",
  errorMessage = "エラーが発生しました",
  successParam = "success",
  errorParam = "error",
  timeParam = "t",
}: UseToastHandlerOptions = {}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const toastShownRef = useRef(false);

  useEffect(() => {
    // URLパラメータからsuccessとerrorを取得
    const success = searchParams.get(successParam);
    const error = searchParams.get(errorParam);

    // パラメータが存在し、まだトーストが表示されていない場合のみ表示
    if ((success === "true" || error === "true") && !toastShownRef.current) {
      if (success === "true") {
        toast.success(successMessage);
      } else if (error === "true") {
        toast.error(errorMessage);
      }

      toastShownRef.current = true; // トーストが表示されたことをマーク

      // URLからパラメーターを削除
      const params = new URLSearchParams(searchParams.toString());
      params.delete(successParam);
      params.delete(errorParam);

      // タイムスタンプパラメーターも削除
      if (params.has(timeParam)) {
        params.delete(timeParam);
      }

      // 新しいURLを構築
      const newUrl = params.toString()
        ? `${pathname}?${params.toString()}`
        : pathname;

      // URLを更新（履歴に残さずに置き換え）
      router.replace(newUrl, { scroll: false });
    }
  }, [
    searchParams,
    pathname,
    router,
    successMessage,
    errorMessage,
    successParam,
    errorParam,
    timeParam,
  ]);
}
