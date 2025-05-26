"use client";

import { useToastHandler } from "@/hooks/useToastHandler";

type ToastHandlerProps = {
  successMsg?: string;
  errorMsg?: string;
};

/**
 * URLパラメータに基づいてトースト通知を表示するコンポーネント
 * @returns JSX.Element
 */
const ToastHandler = ({ successMsg, errorMsg }: ToastHandlerProps) => {
  const successMessage = successMsg || "成功しました";
  const errorMessage = errorMsg || "失敗しました";
  useToastHandler({
    successMessage,
    errorMessage,
  });

  // このコンポーネントは何も表示しない
  return null;
};

export default ToastHandler;
