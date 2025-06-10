"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  ReactNode,
} from "react";

import { siteConfig } from "@/lib/config/siteConfig";

interface InfiniteScrollContextType {
  isLoading: boolean;
  hasMore: boolean;
  setIsLoading: (loading: boolean) => void;
  setHasMore: (hasMore: boolean) => void;
  loadMore: (callback: () => Promise<void>) => Promise<void>;
}

const InfiniteScrollContext = createContext<
  InfiniteScrollContextType | undefined
>(undefined);

export function useInfiniteScroll() {
  const context = useContext(InfiniteScrollContext);
  if (context === undefined) {
    throw new Error(
      "useInfiniteScroll must be used within an InfiniteScrollProvider",
    );
  }
  return context;
}

interface InfiniteScrollProviderProps {
  children: ReactNode;
}

export function InfiniteScrollProvider({
  children,
}: InfiniteScrollProviderProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const loadMore = useCallback(
    async (callback: () => Promise<void>) => {
      if (isLoading || !hasMore) {
        return;
      }

      try {
        setIsLoading(true);
        await callback();
      } catch (error) {
        console.error("Error loading more items:", error);
        setHasMore(false);
      } finally {
        setIsLoading(false);
      }
    },
    [isLoading, hasMore],
  );

  return (
    <InfiniteScrollContext.Provider
      value={{
        isLoading,
        hasMore,
        setIsLoading,
        setHasMore,
        loadMore,
      }}
    >
      {children}
    </InfiniteScrollContext.Provider>
  );
}

export function useInfiniteData<T, P extends unknown[]>({
  initialData,
  initialError,
  fetchFunction,
  fetchParams = [] as unknown as P,
  pageSize = siteConfig.pagination.checkPoints.itemsPerPage,
  itemStatusChangeCount,
}: {
  initialData: T[] | undefined;
  initialError: unknown | null;
  fetchFunction: (page: number, pageSize: number, ...params: P) => Promise<T[]>;
  fetchParams?: P;
  pageSize?: number;
  itemStatusChangeCount: number;
}) {
  const [data, setData] = useState<T[]>(initialData || []);
  const [error, setError] = useState<unknown | null>(initialError);
  const [page, setPage] = useState<number>(1);
  const { setHasMore, isLoading } = useInfiniteScroll();

  /*
   * 初期データが変更されたらたら、設定を初期化
   */
  useEffect(() => {
    if (initialData) {
      setData(initialData);
    }

    if (initialData && initialData.length < pageSize) {
      setHasMore(false);
    }

    setPage(1);

    setError(initialError);
  }, [initialData, initialError, pageSize, setHasMore]);

  // 前回の itemStatusChangeCount を記録する参照
  const prevCountRef = React.useRef(0);

  /*
   * itemの状態変更の際の再取得
   * 例）いいねや削除が実行された場合
   */
  useEffect(() => {
    const hoge = async () => {
      try {
        const currentPage = page;
        let allNewData: T[] = [];

        for (let i = 1; i <= currentPage; i++) {
          const pageData = await fetchFunction(i, pageSize, ...fetchParams);
          allNewData = [...allNewData, ...pageData];
          if (pageData.length < pageSize) {
            break;
          }
        }

        // データが0件の場合は早期リターン
        if (allNewData.length === 0) {
          setHasMore(false);
          return;
        }

        setData([...allNewData]);
      } catch (err) {
        console.error("Error loading more data:", err);
      }
    };

    // itemStatusChangeCount が変更され、かつ0より大きい場合のみ実行
    if (
      itemStatusChangeCount > 0 &&
      itemStatusChangeCount !== prevCountRef.current
    ) {
      prevCountRef.current = itemStatusChangeCount;
      hoge();
    }
  }, [
    itemStatusChangeCount,
    fetchFunction,
    fetchParams,
    pageSize,
    page,
    setHasMore,
  ]);

  const loadMoreData = async () => {
    // すでにロード中の場合は処理をスキップ
    if (isLoading) {
      return;
    }

    const nextPage = page + 1;
    try {
      const newData = await fetchFunction(nextPage, pageSize, ...fetchParams);

      // データが0件の場合は早期リターン
      if (newData.length === 0) {
        setHasMore(false);
        return;
      }

      setData((prevData) => [...prevData, ...newData]);
      setPage(nextPage);

      // 取得したデータがページサイズ未満ならもうデータがないと判断
      if (newData.length < pageSize) {
        setHasMore(false);
      }
    } catch (err) {
      console.error("Error loading more data:", err);
    }
  };

  return {
    data,
    error,
    loadMoreData,
    setData,
    page,
  };
}
