"use client";

import { useState, useEffect, useCallback } from "react";
import NotFound from "@/components/ui/NotFound";
import CheckPointsUI from "@/components/ui/CheckPoints";
import { ApiErrorType, CheckPointType } from "@/lib/types";
import { checkPointsAPI } from "@/lib/api/supabase/checkPointsAPI";
import Error from "@/components/ui/Error";
import Spinner from "@/components/ui/Spinner";
import InfiniteScroll from "@/components/ui/InfiniteScroll";
import { useInfiniteScroll } from "@/contexts/InfiniteScrollContext";

export default function CheckPoints({ profileId }: { profileId: string }) {
  const [checkPoints, setCheckPoints] = useState<CheckPointType[]>([]);
  const [error, setError] = useState<ApiErrorType | null>(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const { setHasMore } = useInfiniteScroll();
  const ITEMS_PER_PAGE = 5;

  const fetchInitialCheckPoints = useCallback(async () => {
    try {
      setLoading(true);
      const data = await checkPointsAPI.getCheckPointsByProfileId(
        profileId,
        undefined,
        1,
        ITEMS_PER_PAGE,
      );
      setCheckPoints(data);

      // 取得したデータが1ページ分より少なければ、もうデータがないと判断
      if (data.length < ITEMS_PER_PAGE) {
        setHasMore(false);
      }
    } catch (err) {
      setError(err as ApiErrorType);
    } finally {
      setLoading(false);
    }
  }, [profileId, setHasMore]);

  const loadMoreCheckPoints = async () => {
    try {
      const nextPage = page + 1;
      const newData = await checkPointsAPI.getCheckPointsByProfileId(
        profileId,
        undefined,
        nextPage,
        ITEMS_PER_PAGE,
      );
      if (newData.length === 0 || newData.length < ITEMS_PER_PAGE) {
        console.log("これ以上のデータはありません");
        setHasMore(false);
      }

      setCheckPoints((prev) => [...prev, ...newData]);
      setPage(nextPage);
    } catch (err) {
      console.error("追加のチェックポイント取得に失敗しました:", err);
      setHasMore(false);
    }
  };

  useEffect(() => {
    fetchInitialCheckPoints();
  }, [fetchInitialCheckPoints]);

  return (
    <>
      <h2 className="text-2xl font-bold text-amber-800 mb-6 border-b-2 border-amber-200 pb-2">
        投稿したチェックポイント ({checkPoints.length})
      </h2>
      {error ? (
        <Error />
      ) : loading && checkPoints.length === 0 ? (
        <Spinner />
      ) : checkPoints.length === 0 ? (
        <NotFound msg="まだ鑑定ポイントの投稿はありません" />
      ) : (
        <InfiniteScroll onLoadMore={loadMoreCheckPoints}>
          <CheckPointsUI checkPoints={checkPoints} />
        </InfiniteScroll>
      )}
    </>
  );
}
