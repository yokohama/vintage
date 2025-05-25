"use client";

import Error from "@/components/ui/Error";
import NotFound from "@/components/ui/NotFound";
import Spinner from "@/components/ui/Spinner";
import CheckPointsUI from "@/components/ui/CheckPoints";
import { useCheckPoints } from "@/hooks/useCheckPoints";

export default function CheckPoints() {
  const { checkPoints, loading, error } = useCheckPoints();

  if (loading) {
    return <Spinner />;
  }

  if (error) {
    return <Error />;
  }

  if (checkPoints?.length === 0 || !checkPoints) {
    return <NotFound msg="鑑定ポイントが見つかりませんでした。" />;
  }

  return <CheckPointsUI checkPoints={checkPoints} />;
}
