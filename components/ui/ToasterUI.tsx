"use client";

import { Toaster, toast } from "sonner";
import { useEffect } from "react";

// 共通のスタイル設定
const baseClassNames =
  "bg-white text-gray-800 border border-gray-200 rounded-lg shadow-md";

// 各タイプ別のスタイル設定
const successClassNames = `${baseClassNames} border-l-4 border-l-green-500`;
const errorClassNames = `${baseClassNames} border-l-4 border-l-red-500`;
const infoClassNames = `${baseClassNames} border-l-4 border-l-blue-500`;

// カスタムトースト関数をオーバーライド
const customizeToast = () => {
  const originalSuccess = toast.success;
  const originalError = toast.error;
  const originalInfo = toast.info;

  toast.success = (message, options) => {
    return originalSuccess(message, {
      ...options,
      className: successClassNames,
    });
  };

  toast.error = (message, options) => {
    return originalError(message, {
      ...options,
      className: errorClassNames,
    });
  };

  toast.info = (message, options) => {
    return originalInfo(message, {
      ...options,
      className: infoClassNames,
    });
  };
};

const ToasterUI = () => {
  // コンポーネントがマウントされたときにカスタムトースト関数を設定
  useEffect(() => {
    customizeToast();
  }, []);

  return (
    <Toaster
      position="top-center"
      theme="light"
      richColors
      duration={3000}
      className="rounded-lg shadow-lg"
      toastOptions={{
        className: baseClassNames,
      }}
    />
  );
};

export default ToasterUI;
