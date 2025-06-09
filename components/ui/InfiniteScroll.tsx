"use client";

import { useEffect, useRef, ReactNode } from "react";
import { useInfiniteScroll } from "@/contexts/InfiniteScrollContext";

interface InfiniteScrollProps {
  children: ReactNode;
  onLoadMore: () => Promise<void>;
  threshold?: number;
}

const InfiniteScroll = ({
  children,
  onLoadMore,
  threshold = 200,
}: InfiniteScrollProps) => {
  const { isLoading, hasMore, loadMore } = useInfiniteScroll();
  const observerRef = useRef<HTMLDivElement>(null);
  const onLoadMoreRef = useRef(onLoadMore);
  const loadMoreRef = useRef(loadMore);
  const isLoadingRef = useRef(isLoading);
  const hasMoreRef = useRef(hasMore);

  // onLoadMoreの参照を更新
  useEffect(() => {
    onLoadMoreRef.current = onLoadMore;
  }, [onLoadMore]);

  // loadMoreの参照を更新
  useEffect(() => {
    loadMoreRef.current = loadMore;
  }, [loadMore]);

  // isLoadingの参照を更新
  useEffect(() => {
    isLoadingRef.current = isLoading;
  }, [isLoading]);

  // hasMoreの参照を更新
  useEffect(() => {
    hasMoreRef.current = hasMore;
  }, [hasMore]);

  useEffect(() => {
    let isMounted = true;

    const handleIntersection = (entries: IntersectionObserverEntry[]) => {
      const [entry] = entries;
      if (
        entry.isIntersecting &&
        hasMoreRef.current &&
        !isLoadingRef.current &&
        isMounted
      ) {
        // 一度だけ実行されるようにする
        const currentLoadMore = loadMoreRef.current;
        const currentOnLoadMore = onLoadMoreRef.current;

        if (currentLoadMore && currentOnLoadMore) {
          currentLoadMore(currentOnLoadMore);
        }
      }
    };

    const observer = new IntersectionObserver(handleIntersection, {
      rootMargin: `0px 0px ${threshold}px 0px`,
    });

    const currentObserver = observerRef.current;
    if (currentObserver) {
      observer.observe(currentObserver);
    }

    return () => {
      isMounted = false;
      if (currentObserver) {
        observer.unobserve(currentObserver);
      }
      observer.disconnect();
    };
  }, [threshold]);

  return (
    <>
      {children}
      <div ref={observerRef} className="h-4 w-full" />
      {isLoading && (
        <div className="w-full flex justify-center py-4">
          <div className="animate-spin h-6 w-6 border-2 border-gray-500 rounded-full border-t-transparent"></div>
        </div>
      )}
    </>
  );
};

export default InfiniteScroll;
