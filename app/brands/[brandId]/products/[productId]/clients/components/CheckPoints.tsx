"use client";

import { CheckPointType, VintageType } from "@/lib/types";
import AddCheckPointModal from "./AddCheckPointModal";
import { useCheckPoints } from "../hooks/useCheckPoints";
import NotFound from "@/components/ui/NotFound";
import { useEffect, useState, useCallback } from "react";
import { checkPointsAPI } from "@/lib/api/supabase/checkPointsAPI";
import { Standerd } from "@/components/ui/OriginalButton";
import CheckPoint from "./CheckPoint";
import { usePageTitle } from "@/contexts/PageTitleContext";
import Spinner from "@/components/ui/Spinner";
import Error from "@/components/ui/Error";
import InfiniteScroll from "@/components/ui/InfiniteScroll";
import { useInfiniteScroll } from "@/contexts/InfiniteScrollContext";
import { siteConfig } from "@/lib/config/siteConfig";

interface CheckPointsProps {
  vintage: VintageType;
}

const CheckPoints = ({ vintage }: CheckPointsProps) => {
  const [checkPoints, setCheckPoints] = useState<CheckPointType[]>([]);
  const { isFixed } = usePageTitle();
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [lastCheckPointLocked, setLastCheckPointLocked] =
    useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);
  const [page, setPage] = useState(1);
  const { setHasMore } = useInfiniteScroll();
  const ITEMS_PER_PAGE = siteConfig.pagination.checkPoints.itemsPerPage;

  useEffect(() => {
    const fetchCheckPoints = async () => {
      try {
        setLoading(true);
        const checkPointsData = await checkPointsAPI.getCheckPointsByVintageId(
          vintage.id,
          undefined,
          1,
          ITEMS_PER_PAGE,
        );
        setCheckPoints(checkPointsData);

        // 取得したデータが1ページ分より少なければ、もうデータがないと判断
        if (checkPointsData.length < ITEMS_PER_PAGE) {
          setHasMore(false);
        } else {
          setHasMore(true);
        }

        setError(false);
      } catch (error) {
        console.error("チェックポイントの取得に失敗しました:", error);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchCheckPoints();
  }, [vintage.id, setHasMore]);

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
  }, [page, vintage.id, setHasMore]);

  useEffect(() => {
    if (!isFixed) {
      // isFixedがfalseの場合、すべてのチェックポイントを非アクティブにする
      setActiveIndex(null);
      return;
    }

    const handleScroll = () => {
      // 最初にlastCheckPointLockedをチェックして特別な処理を行う
      if (lastCheckPointLocked) {
        const pageTitleElement = document.querySelector(
          ".page-title-container",
        );
        if (!pageTitleElement) return;

        const pageTitleRect = pageTitleElement.getBoundingClientRect();
        const pageTitleBottom = pageTitleRect.bottom;

        // すべてのCheckPointを取得
        const allCheckPointCards = document.querySelectorAll(
          ".checkpoint-card-container",
        );

        // 最後から一つ前のCheckPointのインデックス
        const secondLastIndex = checkPoints.length - 2;

        // 最後から一つ前のCheckPointが存在する場合
        if (
          secondLastIndex >= 0 &&
          allCheckPointCards.length > secondLastIndex
        ) {
          const secondLastCardRect =
            allCheckPointCards[secondLastIndex].getBoundingClientRect();

          // 最後から一つ前のCheckPointがPageTitleに重なっていない場合
          if (secondLastCardRect.top >= pageTitleBottom) {
            setActiveIndex(secondLastIndex);
          } else {
            // 最後のCheckPointをactiveに保持
            setActiveIndex(checkPoints.length - 1);
          }
        }
        return;
      }

      const pageTitleElement = document.querySelector(".page-title-container");
      if (!pageTitleElement) return;

      const pageTitleRect = pageTitleElement.getBoundingClientRect();
      const pageTitleBottom = pageTitleRect.bottom;

      // すべてのCheckPointを取得（active と inactive の両方）
      const allCheckPointCards = document.querySelectorAll(
        ".checkpoint-card-container",
      );

      // まずすべてのカードをinactiveに戻す
      setActiveIndex(null);

      // PageTitleと重なっていない最初のcheckPointCardを探す
      for (let i = 0; i < allCheckPointCards.length; i++) {
        const cardRect = allCheckPointCards[i].getBoundingClientRect();

        // このItemがPageTitleと重なっていない（下にある）場合
        if (cardRect.top >= pageTitleBottom) {
          // このItemをactiveに変更
          setActiveIndex(i);
          break;
        }
      }
    };

    // 初期実行（DOMが確実に読み込まれた後）
    const initTimeout = setTimeout(handleScroll, 100);

    // スクロールイベントリスナーを追加
    window.addEventListener("scroll", handleScroll);

    // クリーンアップ
    return () => {
      clearTimeout(initTimeout);
      window.removeEventListener("scroll", handleScroll);
    };
  }, [isFixed, lastCheckPointLocked, checkPoints.length]); // checkPoints.lengthを依存配列に追加

  // activeIndexが変更されたときに実行されるエフェクト
  useEffect(() => {
    // 最後のCheckPointがactiveになったかどうかをチェック
    if (
      activeIndex !== null &&
      checkPoints.length > 0 &&
      activeIndex === checkPoints.length - 1
    ) {
      setLastCheckPointLocked(true);
    } else {
      setLastCheckPointLocked(false);
    }
  }, [activeIndex, checkPoints.length]);

  const {
    isAddModalOpen,
    setIsAddModalOpen,
    handleAddButtonClick,
    addNewCheckPoint,
  } = useCheckPoints(checkPoints || []);

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
        <Standerd
          label="追加"
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
