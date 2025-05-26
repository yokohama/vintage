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

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && hasMore && !isLoading) {
          loadMore(onLoadMore);
        }
      },
      {
        rootMargin: `0px 0px ${threshold}px 0px`,
      },
    );

    const currentObserver = observerRef.current;
    if (currentObserver) {
      observer.observe(currentObserver);
    }

    return () => {
      if (currentObserver) {
        observer.unobserve(currentObserver);
      }
    };
  }, [onLoadMore, hasMore, isLoading, loadMore, threshold]);

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
