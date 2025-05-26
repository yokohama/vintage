"use client";

import { useState, useCallback, useEffect } from "react";
import { ApiErrorType, CheckPointType } from "@/lib/types";
import { checkPointsAPI } from "@/lib/api/supabase/checkPointsAPI";
import { useInfiniteScroll } from "@/contexts/InfiniteScrollContext";

interface UseInfiniteCheckPointsParams {
  profileId?: string;
  initialPage?: number;
  itemsPerPage?: number;
  fetchFunction?: (page: number, limit: number) => Promise<CheckPointType[]>;
}

export function useInfiniteCheckPoints({
  profileId,
  initialPage = 1,
  itemsPerPage = 5,
  fetchFunction,
}: UseInfiniteCheckPointsParams = {}) {
  const [checkPoints, setCheckPoints] = useState<CheckPointType[]>([]);
  const [error, setError] = useState<ApiErrorType | null>(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(initialPage);
  const { setHasMore } = useInfiniteScroll();

  // デフォルトのフェッチ関数（プロファイルIDによる取得）
  const defaultFetchFunction = useCallback(
    async (page: number, limit: number) => {
      if (!profileId) {
        return checkPointsAPI.getCheckPoints();
      }
      return checkPointsAPI.getCheckPointsByProfileId(
        profileId,
        undefined,
        page,
        limit,
      );
    },
    [profileId],
  );

  // 使用するフェッチ関数
  const fetchData = fetchFunction || defaultFetchFunction;

  // 初期データの取得
  const fetchInitialCheckPoints = useCallback(async () => {
    try {
      setLoading(true);
      console.log("🔄 初期チェックポイントを取得中...");
      const data = await fetchData(initialPage, itemsPerPage);
      console.log(`✅ 初期チェックポイント ${data.length}件取得完了`);
      setCheckPoints(data);

      // 取得したデータが1ページ分より少なければ、もうデータがないと判断
      if (data.length < itemsPerPage) {
        console.log("これ以上のデータはありません (初期ロード)");
        setHasMore(false);
      }
    } catch (err) {
      setError(err as ApiErrorType);
      console.error("チェックポイントの取得に失敗しました:", err);
    } finally {
      setLoading(false);
    }
  }, [fetchData, initialPage, itemsPerPage, setHasMore]);

  // 追加データの取得
  const loadMoreCheckPoints = async () => {
    try {
      const nextPage = page + 1;
      console.log(`追加チェックポイントを取得中... (ページ: ${nextPage})`);
      const newData = await fetchData(nextPage, itemsPerPage);
      console.log(
        `追加チェックポイント ${newData.length}件取得完了 (ページ: ${nextPage})`,
      );

      if (newData.length === 0 || newData.length < itemsPerPage) {
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

  // 初期データの取得
  useEffect(() => {
    fetchInitialCheckPoints();
  }, [fetchInitialCheckPoints]);

  return {
    checkPoints,
    loading,
    error,
    loadMoreCheckPoints,
  };
}
