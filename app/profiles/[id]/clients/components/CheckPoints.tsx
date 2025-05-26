"use client";

import { useState, useEffect } from "react";
import NotFound from "@/components/ui/NotFound";
import CheckPointsUI from "@/components/ui/CheckPoints";
import { ApiErrorType, CheckPointType } from "@/lib/types";
import { checkPointsAPI } from "@/lib/api/supabase/checkPointsAPI";
import Error from "@/components/ui/Error";
import Spinner from "@/components/ui/Spinner";

export default function CheckPoints({ profileId }: { profileId: string }) {
  const [checkPoints, setCheckPoints] = useState<CheckPointType[]>([]);
  const [error, setError] = useState<ApiErrorType | null>(null);
  const [loading, setLoading] = useState(true);

  console.log(profileId);

  useEffect(() => {
    const fetchCheckPoints = async () => {
      try {
        setLoading(true);
        const data = await checkPointsAPI.getCheckPointsByProfileId(profileId);
        setCheckPoints(data);
      } catch (err) {
        setError(err as ApiErrorType);
        console.error("チェックポイントの取得に失敗しました:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCheckPoints();
  }, [profileId]);

  return (
    <>
      <h2 className="text-2xl font-bold text-amber-800 mb-6 border-b-2 border-amber-200 pb-2">
        投稿したチェックポイント ({checkPoints.length})
      </h2>
      {error ? (
        <Error />
      ) : loading ? (
        <Spinner />
      ) : checkPoints.length === 0 ? (
        <NotFound msg="まだ鑑定ポイントの投稿はありません" />
      ) : (
        <CheckPointsUI checkPoints={checkPoints} />
      )}
    </>
  );
}
