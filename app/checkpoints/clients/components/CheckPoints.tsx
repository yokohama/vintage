"use client";

import Error from "@/components/ui/Error";
import NotFound from "@/components/ui/NotFound";
import Spinner from "@/components/ui/Spinner";
import CheckPointsUI from "@/components/ui/CheckPoints";
import { useInfiniteCheckPoints } from "@/hooks/useInfiniteCheckPoints";
import { checkPointsAPI } from "@/lib/api/supabase/checkPointsAPI";
import InfiniteScroll from "@/components/ui/InfiniteScroll";
import { useCallback } from "react";
import { siteConfig } from "@/lib/config/siteConfig";

export default function CheckPoints() {
  const ITEMS_PER_PAGE = siteConfig.pagination.checkPoints.itemsPerPage;

  // useCallbackを使用して関数参照を安定させる
  const fetchCheckPoints = useCallback(async (page: number, limit: number) => {
    return await checkPointsAPI.getCheckPoints(undefined, page, limit);
  }, []);

  const { checkPoints, loading, error, loadMoreCheckPoints } =
    useInfiniteCheckPoints(fetchCheckPoints, ITEMS_PER_PAGE);

  return (
    <>
      {error ? (
        <Error />
      ) : loading && checkPoints.length === 0 ? (
        <Spinner />
      ) : checkPoints.length === 0 ? (
        <NotFound msg="鑑定ポイントが見つかりませんでした。" />
      ) : (
        <InfiniteScroll onLoadMore={loadMoreCheckPoints}>
          <CheckPointsUI checkPoints={checkPoints} />
        </InfiniteScroll>
      )}
    </>
  );
}
