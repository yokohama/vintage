"use client";

import { VintageType } from "@/lib/types";
import AddCheckPointModal from "./AddCheckPointModal";
import { useCheckPoints } from "../hooks/useCheckPoints";
import NotFound from "@/components/ui/NotFound";
import { useState, useCallback } from "react";
import { checkPointsAPI } from "@/lib/api/supabase/checkPointsAPI";
import { AddButton } from "@/components/ui/OriginalButton";
import CheckPoint from "./CheckPoint";
import Spinner from "@/components/ui/Spinner";
import Error from "@/components/ui/Error";
import InfiniteScroll from "@/components/ui/InfiniteScroll";
import { useInfiniteScroll } from "@/contexts/InfiniteScrollContext";
import { siteConfig } from "@/lib/config/siteConfig";

interface CheckPointsProps {
  vintage: VintageType;
}

const CheckPoints = ({ vintage }: CheckPointsProps) => {
  const ITEMS_PER_PAGE = siteConfig.pagination.checkPoints.itemsPerPage;

  const {
    checkPoints,
    setCheckPoints,
    isAddModalOpen,
    setIsAddModalOpen,
    handleAddButtonClick,
    addNewCheckPoint,
    loading,
    error,
    activeIndex,
  } = useCheckPoints(vintage, ITEMS_PER_PAGE);

  const [page, setPage] = useState(1);
  const { setHasMore } = useInfiniteScroll();

  const loadMoreCheckPoints = useCallback(async () => {
    try {
      const nextPage = page + 1;
      const newData = await checkPointsAPI.getCheckPointsByVintageId(
        vintage.id,
        undefined,
        nextPage,
        ITEMS_PER_PAGE,
      );

      if (newData.length === 0 || newData.length < ITEMS_PER_PAGE) {
        console.log("これ以上のデータはありません");
        setHasMore(false);
      }

      setCheckPoints((prev) => [...prev, ...newData]);
      setPage(nextPage);
    } catch (err) {
      console.error("追加のチェックポイント取得に失敗しました:", err);
      setHasMore(false);
    }
  }, [page, vintage.id, setHasMore, ITEMS_PER_PAGE]);

  return (
    <div>
      <AddCheckPointModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        vintageId={vintage.id}
        onSuccess={(newCheckPoint) => {
          addNewCheckPoint(newCheckPoint);
          // 新しいチェックポイントは自動的に次回のフェッチで取得されるため、
          // ここでは何もしない
          setIsAddModalOpen(false);
        }}
      />

      <div className="flex justify-end mr-4">
        <AddButton
          label="鑑定ポイント"
          className="bg-amber-600 hover:bg-amber-700 text-white text-xs"
          onClick={handleAddButtonClick}
        />
      </div>
      <div className="">
        {error ? (
          <Error />
        ) : loading && checkPoints.length === 0 ? (
          <Spinner />
        ) : checkPoints.length === 0 ? (
          <NotFound msg="鑑定ポイントがまだありません。" />
        ) : (
          <InfiniteScroll onLoadMore={loadMoreCheckPoints}>
            <div className="checkpoint-cards-container">
              {checkPoints.map((cp, index) => (
                <div key={index} className="checkpoint-card-container">
                  <CheckPoint
                    checkPoint={cp}
                    setCheckPoints={setCheckPoints}
                    isActive={activeIndex === index}
                  />
                </div>
              ))}
            </div>
          </InfiniteScroll>
        )}
      </div>
    </div>
  );
};

export default CheckPoints;
