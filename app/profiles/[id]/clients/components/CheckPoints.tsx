"use client";

import NotFound from "@/components/ui/NotFound";
import CheckPointsUI from "@/components/ui/CheckPoints";
import { CheckPointType } from "@/lib/types";

type CheckPointsProps = {
  checkPoints: CheckPointType[];
};

export default function CheckPoints({ checkPoints }: CheckPointsProps) {
  if (checkPoints?.length === 0 || !checkPoints) {
    return <NotFound msg="まだ鑑定ポイントの投稿はありません" />;
  }

  return <CheckPointsUI checkPoints={checkPoints} />;
}
