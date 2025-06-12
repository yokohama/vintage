"use client";

import { useEffect } from "react";
import Header from "@/components/ui/Header";
import Footer from "@/components/ui/Footer";
import Link from "next/link";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    // エラーをログに記録
    console.error("鑑定ポイント一覧でエラーが発生しました:", error);
  }, [error]);

  return (
    <main>
      <div className="oldies-container">
        <Header />
        <div className="container mx-auto px-4 py-12 text-center">
          <h2 className="title mb-6">エラーが発生しました</h2>
          <div className="bg-amber-50 rounded-lg shadow-md p-6 mb-8 border border-amber-100 max-w-md mx-auto">
            <p className="error-page-message mb-6">
              鑑定ポイント一覧の表示中にエラーが発生しました。
            </p>
            <div className="flex flex-col md:flex-row justify-center gap-4">
              <button
                onClick={() => reset()}
                className="bg-amber-600 hover:bg-amber-700 text-white px-6 py-2 rounded-md shadow-sm"
              >
                再試行する
              </button>
              <Link
                href="/"
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-6 py-2 rounded-md shadow-sm"
              >
                トップページへ戻る
              </Link>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </main>
  );
}
