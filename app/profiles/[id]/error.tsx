"use client";

import { ErrorPage, ErrorProps } from "@/components/ui/Oops";

export default function Error({ reset }: ErrorProps) {
  return <ErrorPage msg="プロフィールの取得に失敗だぜ" reset={reset} />;
}
