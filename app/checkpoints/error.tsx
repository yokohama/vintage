"use client";

import { ErrorPage, ErrorProps } from "@/components/ui/Oops";

export default function Error({ reset }: ErrorProps) {
  return <ErrorPage msg="鑑定ポイントの一覧でエラーっす" reset={reset} />;
}
