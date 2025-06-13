"use client";

import { ErrorPage, ErrorProps } from "@/components/ui/Oops";

export default function Error({ reset }: ErrorProps) {
  return <ErrorPage msg="プロダクト一覧でエラーが発生したっす" reset={reset} />;
}
