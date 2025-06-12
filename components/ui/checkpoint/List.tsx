"use client";

import { Suspense, useEffect } from "react";
import { useRouter, notFound } from "next/navigation";

import { siteConfig, siteUrls } from "@/lib/config/siteConfig";
import { throwError } from "@/lib/error";
import { InfiniteScrollProvider } from "@/contexts/InfiniteScrollContext";
import InfiniteScroll from "../InfiniteScroll";

import { useInfiniteData } from "@/contexts/InfiniteScrollContext";
import { useCheckPointList } from "@/hooks/useCheckPointList";

import Spinner from "@/components/ui/Spinner";

import CheckPoint from "./CheckPoint";
import { CheckPointType } from "@/lib/types";

import { AddButton } from "../OriginalButton";

type ListProps = {
  brandId?: number;
  brandName?: string;
  productId?: number;
  productName?: string;
  vintageId?: number;
  vintageName?: string;
  profileId?: string;
  profileName?: string;
  likedUserId?: string;
  likedUserName?: string;
};

export const List = ({
  brandId,
  brandName,
  productId,
  productName,
  vintageId,
  vintageName,
  profileId,
  profileName,
  likedUserId,
  likedUserName,
}: ListProps) => {
  const {
    pageTitle,
    activeIndex,
    fetchFunction,
    onStateChangeSuccess,
    cpStatusChangeCount,
    initialCheckPoints,
    initialLoading,
    initialError,
  } = useCheckPointList({
    brandId: brandId || null,
    brandName: brandName || null,
    productId: productId || null,
    productName: productName || null,
    vintageId: vintageId || null,
    vintageName: vintageName || null,
    profileId: profileId || null,
    profileName: profileName || "",
    likedUserId: likedUserId || null,
    likedUserName: likedUserName || null,
  });

  useEffect(() => {
    if (!initialLoading && !initialError && initialCheckPoints.length === 0) {
      notFound();
    }
  }, [initialLoading, initialError, initialCheckPoints]);

  if (initialError) {
    throwError(initialError, "鑑定ポイントの取得でエラーが発生しました");
  }

  const {
    data: checkPoints,
    error,
    loadMoreData,
  } = useInfiniteData<CheckPointType, []>({
    initialData: initialCheckPoints,
    initialError,
    fetchFunction: fetchFunction,
    pageSize: siteConfig.pagination.checkPoints.itemsPerPage,
    itemStatusChangeCount: cpStatusChangeCount,
  });

  if (error) {
    throwError(error, "鑑定ポイントの読み込み中にエラーが発生しました");
  }

  const router = useRouter();

  return (
    <div>
      <div className="flex justify-between items-center px-4 mb-2">
        <h3 className="my-auto flex items-center m-0">
          {`${pageTitle}`} ({checkPoints.length})
        </h3>
        {vintageId && (
          <div className="flex items-center">
            <AddButton
              label="鑑定ポイント"
              className="bg-amber-600 hover:bg-amber-700 text-white text-xs"
              onClick={() => router.push(siteUrls.newCheckPoint(vintageId))}
            />
          </div>
        )}
      </div>

      <Suspense fallback={<Spinner />}>
        <InfiniteScrollProvider>
          <div className="">
            {initialLoading ? (
              <Spinner />
            ) : (
              <InfiniteScroll onLoadMore={loadMoreData}>
                <div className="checkpoint-cards-container">
                  {checkPoints.map((cp, index) => (
                    <div key={index} className="checkpoint-card-container">
                      <CheckPoint
                        checkPoint={cp}
                        isActive={activeIndex === index}
                        onLikeSuccess={onStateChangeSuccess}
                        onDeleteSuccess={onStateChangeSuccess}
                      />
                    </div>
                  ))}
                </div>
              </InfiniteScroll>
            )}
          </div>
        </InfiniteScrollProvider>
      </Suspense>
    </div>
  );
};

export default List;
