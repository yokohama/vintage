"use client";

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
} from "react";

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
      if (isLoading || !hasMore) return;

      try {
        setIsLoading(true);
        await callback();
      } catch (error) {
        console.error("Error loading more items:", error);
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
