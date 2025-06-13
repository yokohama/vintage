"use client";

import { ErrorPage, ErrorProps } from "@/components/ui/Oops";

export default function Error({ reset }: ErrorProps) {
  return <ErrorPage msg="おっと、ブランド一覧で謎エラー" reset={reset} />;
}
