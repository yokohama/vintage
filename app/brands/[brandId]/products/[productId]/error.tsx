"use client";

import { ErrorPage, ErrorProps } from "@/components/ui/Oops";

export default function Error({ reset }: ErrorProps) {
  return <ErrorPage msg="プロダクト詳細で謎エラー" reset={reset} />;
}
