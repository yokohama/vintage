"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase";

import Error from "@/components/ui/Error";
import Spinner from "@/components/ui/Spinner";

// SearchParamsを使用するコンポーネントを分離
function AuthCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // URLからエラーパラメータを確認
        const errorParam = searchParams.get("error");
        const errorDescription = searchParams.get("error_description");

        if (errorParam) {
          console.error(`認証エラー: ${errorParam} - ${errorDescription}`);
          setError(`${errorDescription || errorParam}`);
          return;
        }

        // セッションを取得
        const { data, error } = await supabase.auth.getSession();

        if (error) {
          console.error("認証エラー:", error);
          setError(error.message);
          return;
        } else {
          // デバッグ用：プロフィールの存在確認
          if (data.session?.user) {
            const { error: profileError } = await supabase
              .from("profiles")
              .select("id")
              .eq("id", data.session.user.id)
              .single();

            if (profileError) {
              console.error("プロフィール確認:", profileError.message);
            }
          }

          // 処理が完了したらホームページにリダイレクト
          router.push("/");
        }
      } catch (err: unknown) {
        console.error("認証コールバック処理エラー:", err);
        if (err instanceof Error) {
          const errorObj = err as Error;
          setError(errorObj.message);
        } else if (
          typeof err === "object" &&
          err !== null &&
          "message" in err
        ) {
          setError((err as { message: string }).message);
        } else {
          setError("不明なエラーが発生しました");
        }
      }
    };

    handleAuthCallback();
  }, [router, searchParams]);

  if (error) {
    return (
      <Error
        msg={`認証エラーが発生しました。${error}`}
        returnUrl="/"
        returnUrlLabel="ホームに戻る"
      />
    );
  }

  return <Spinner />;
}

// メインコンポーネント
export default function AuthCallbackPage() {
  return (
    <Suspense fallback={<Spinner />}>
      <AuthCallbackContent />
    </Suspense>
  );
}
