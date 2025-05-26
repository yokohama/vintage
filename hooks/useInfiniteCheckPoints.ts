"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { CheckPointType, ApiErrorType } from "@/lib/types";
import { useInfiniteScroll } from "@/contexts/InfiniteScrollContext";

type FetchCheckPointsFunction = (
  page: number,
  limit: number,
) => Promise<CheckPointType[]>;

export const useInfiniteCheckPoints = (
  fetchFunction: FetchCheckPointsFunction,
  itemsPerPage: number = 5,
) => {
  const [checkPoints, setCheckPoints] = useState<CheckPointType[]>([]);
  const [error, setError] = useState<ApiErrorType | null>(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const { setHasMore } = useInfiniteScroll();

  // 関数参照を安定させるためにuseRefを使用
  const fetchFunctionRef = useRef(fetchFunction);
  const itemsPerPageRef = useRef(itemsPerPage);

  // 依存関係が変更された場合にrefを更新
  useEffect(() => {
    fetchFunctionRef.current = fetchFunction;
    itemsPerPageRef.current = itemsPerPage;
  }, [fetchFunction, itemsPerPage]);

  const fetchInitialCheckPoints = useCallback(async () => {
    try {
      setLoading(true);
      const data = await fetchFunctionRef.current(1, itemsPerPageRef.current);
      setCheckPoints(data);

      // 取得したデータが1ページ分より少なければ、もうデータがないと判断
      if (data.length < itemsPerPageRef.current) {
        setHasMore(false);
      } else {
        setHasMore(true);
      }
    } catch (err) {
      setError(err as ApiErrorType);
    } finally {
      setLoading(false);
    }
  }, [setHasMore]);

  const loadMoreCheckPoints = async () => {
    try {
      const nextPage = page + 1;
      const newData = await fetchFunctionRef.current(
        nextPage,
        itemsPerPageRef.current,
      );
      if (newData.length === 0 || newData.length < itemsPerPageRef.current) {
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

  // 初回マウント時のみ実行されるように修正
  useEffect(() => {
    fetchInitialCheckPoints();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    checkPoints,
    loading,
    error,
    loadMoreCheckPoints,
  };
};
