"use client";

import { ErrorPage, ErrorProps } from "@/components/ui/Oops";

export default function Error({ error, reset }: ErrorProps) {
  const msg = "プロダクト詳細でエラーが発生しました:";
  return <ErrorPage msg={msg} error={error} reset={reset} />;
}
