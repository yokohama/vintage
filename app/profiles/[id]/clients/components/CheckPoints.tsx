"use client";

import NotFound from "@/components/ui/NotFound";
import CheckPointsUI from "@/components/ui/CheckPoints";
import { checkPointsAPI } from "@/lib/api/supabase/checkPointsAPI";
import Error from "@/components/ui/Error";
import Spinner from "@/components/ui/Spinner";
import InfiniteScroll from "@/components/ui/InfiniteScroll";
import { useInfiniteCheckPoints } from "@/hooks/useInfiniteCheckPoints";
import { useCallback } from "react";
import { siteConfig } from "@/lib/config/siteConfig";

export default function CheckPoints({ profileId }: { profileId: string }) {
  const ITEMS_PER_PAGE = siteConfig.pagination.checkPoints.itemsPerPage;

  const fetchCheckPoints = useCallback(
    async (page: number, limit: number) => {
      return await checkPointsAPI.getCheckPointsByProfileId(
        profileId,
        undefined,
        page,
        limit,
      );
    },
    [profileId],
  );

  const { checkPoints, loading, error, loadMoreCheckPoints } =
    useInfiniteCheckPoints(fetchCheckPoints, ITEMS_PER_PAGE);

  return (
    <>
      <h3 className="title">投稿したチェックポイント ({checkPoints.length})</h3>
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
