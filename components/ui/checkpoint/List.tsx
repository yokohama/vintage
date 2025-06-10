"use client";

import { Suspense } from "react";

import { useRouter } from "next/navigation";

import { siteConfig, siteUrls } from "@/lib/config/siteConfig";
import { InfiniteScrollProvider } from "@/contexts/InfiniteScrollContext";
import InfiniteScroll from "../InfiniteScroll";

import { useInfiniteData } from "@/contexts/InfiniteScrollContext";
import { useCheckPointList } from "@/hooks/useCheckPointList";

import Error from "@/components/ui/Error";
import Spinner from "@/components/ui/Spinner";
import NotFound from "@/components/ui/NotFound";

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
    productId: productId || null,
    vintageId: vintageId || null,
    profileId: profileId || null,
    brandName: brandName || "",
    productName: productName || "",
    vintageName: vintageName || "",
    profileName: profileName || "",
    likedUserId: likedUserId || null,
  });

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

  const router = useRouter();

  return (
    <div>
      {vintageId && (
        <div className="flex justify-end mr-4">
          <AddButton
            label="鑑定ポイント"
            className="bg-amber-600 hover:bg-amber-700 text-white text-xs"
            onClick={() => router.push(siteUrls.newCheckPoint(vintageId))}
          />
        </div>
      )}

      <h3 className="title">
        {`${pageTitle}の鑑定ポイント`} ({checkPoints.length})
      </h3>

      <Suspense fallback={<Spinner />}>
        <InfiniteScrollProvider>
          <div className="">
            {error ? (
              <Error />
            ) : initialLoading ? (
              <Spinner />
            ) : checkPoints.length === 0 ? (
              <NotFound
                msg={
                  profileId
                    ? "まだ鑑定ポイントの投稿はありません"
                    : "鑑定ポイントがまだありません。"
                }
              />
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
