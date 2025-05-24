"use client";

import { CheckPointType, VintageType } from "@/lib/types";
import AddCheckPointModal from "./AddCheckPointModal";
//import ActiveCheckPoint from "./ActiveCheckPoint";
import { useCheckPoints } from "../hooks/useCheckPoints";
import NotFound from "@/components/ui/NotFound";
import { useEffect, useRef, useState } from "react";
import { checkPointsAPI } from "@/lib/api/supabase/checkPointsAPI";
import { Standerd } from "@/components/ui/OriginalButton";
import CheckPoint from "./CheckPoint";
import { usePageTitle } from "@/contexts/PageTitleContext";

interface CheckPointsProps {
  vintage: VintageType;
}

const CheckPoints = ({ vintage }: CheckPointsProps) => {
  const [checkPoints, setCheckPoints] = useState<CheckPointType[]>(
    vintage.checkPoints || [],
  );
  const { isFixed } = usePageTitle();

  useEffect(() => {
    const fetchCheckPoints = async () => {
      try {
        const checkPointsData = await checkPointsAPI.getCheckPointsByVintageId(
          vintage.id,
        );
        setCheckPoints(checkPointsData);
      } catch (error) {
        console.error("チェックポイントの取得に失敗しました:", error);
      }
    };

    fetchCheckPoints();
  }, [vintage.id]);

  const {
    isAddModalOpen,
    setIsAddModalOpen,
    handleAddButtonClick,
    addNewCheckPoint,
  } = useCheckPoints(checkPoints || []);
  const checkPointsRef = useRef<HTMLDivElement>(null);
  const checkPointRefs = useRef<(HTMLDivElement | null)[]>([]);

  const [closestCheckPointId, setClosestCheckPointId] = useState<number | null>(
    null,
  );
  const lastScrollPosition = useRef<number>(0);

  // スクロールを一時停止する関数
  const stopScroll = () => {
    const currentY = window.scrollY;
    let isUserScrolling = false;
    let lastY = currentY;

    // 現在のスクロール位置で即座に停止
    window.scrollTo({
      top: currentY,
      behavior: "auto",
    });

    // ユーザーが再度スクロールを開始したかを検出する関数
    const detectUserScroll = () => {
      const newY = window.scrollY;
      // ユーザーが意図的にスクロールしたと判断する閾値（5px以上の変化）
      if (Math.abs(newY - lastY) > 5) {
        isUserScrolling = true;
      }
      lastY = newY;
    };

    // スクロール検出リスナーを追加
    window.addEventListener("scroll", detectUserScroll, { passive: true });

    // 慣性スクロールを確実に止めるために、短い間隔で複数回スクロール位置を固定
    const intervalId = setInterval(() => {
      // ユーザーが再度スクロールを開始した場合は停止処理を中止
      if (isUserScrolling) {
        clearInterval(intervalId);
        window.removeEventListener("scroll", detectUserScroll);
        return;
      }

      // 慣性スクロールによる微小な移動を検出して元の位置に戻す
      if (Math.abs(window.scrollY - currentY) > 1) {
        window.scrollTo({
          top: currentY,
          behavior: "auto",
        });
      }
    }, 5);

    // 300ms後に停止処理を終了
    setTimeout(() => {
      clearInterval(intervalId);
      window.removeEventListener("scroll", detectUserScroll);
    }, 300);
  };

  useEffect(() => {
    if (closestCheckPointId !== null) {
      console.log("hoge");
      stopScroll();
    }
  }, [closestCheckPointId]);

  // スクロール時に固定されているPageTitleに最も近いCheckPointのIDをログ出力
  useEffect(() => {
    if (!isFixed || !checkPointRefs.current.length) return;

    const handleScroll = () => {
      // 現在のスクロール位置を記録
      const currentScrollY = window.scrollY;
      lastScrollPosition.current = currentScrollY;

      const pageTitleHeight = 60; // PageTitleの高さを仮定（実際の値に調整してください）
      const pageTitleBottom = pageTitleHeight;

      let closestCheckPoint = checkPoints[0];
      let minDistance = Infinity;
      let shouldStopScroll = false;

      // 各CheckPointの位置を確認し、PageTitleに最も近いものを見つける
      checkPointRefs.current.forEach((ref, index) => {
        if (ref && index < checkPoints.length) {
          const rect = ref.getBoundingClientRect();
          const distance = Math.abs(rect.top - pageTitleBottom);

          // PageTitleに重なっていない場合
          if (rect.top > pageTitleBottom && distance < minDistance) {
            minDistance = distance;
            if (checkPoints[index]) {
              closestCheckPoint = checkPoints[index];
            }

            // CheckPointがPageTitleのすぐ下に来た場合、スクロールを止める条件を設定
            if (
              rect.top >= pageTitleBottom &&
              rect.top <= pageTitleBottom + 20
            ) {
              shouldStopScroll = true;
            }
          }
        }
      });

      if (closestCheckPoint?.id) {
        setClosestCheckPointId(closestCheckPoint.id);
      } else {
        setClosestCheckPointId(null);
      }

      // スクロールを止める条件が満たされた場合、スクロールを停止
      // 前回のスクロール位置と現在のスクロール位置を比較して、下方向へのスクロール時のみ停止
      if (shouldStopScroll && currentScrollY > lastScrollPosition.current) {
        stopScroll();
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isFixed, checkPoints]);

  useEffect(() => {
    if (!isFixed) {
      setClosestCheckPointId(null);
    }
  }, [isFixed]);

  return (
    <div>
      <AddCheckPointModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        vintageId={vintage.id}
        onSuccess={(newCheckPoint) => {
          addNewCheckPoint(newCheckPoint);
          setCheckPoints((prevCheckPoints) => [
            ...prevCheckPoints,
            newCheckPoint,
          ]);
          setIsAddModalOpen(false);
        }}
      />

      <div className="flex justify-end m-4">
        <Standerd
          label="追加"
          className="bg-amber-600 hover:bg-amber-700 text-white text-xs"
          onClick={handleAddButtonClick}
        />
      </div>
      <div className="" ref={checkPointsRef}>
        {checkPoints.length === 0 ? (
          <NotFound msg="鑑定ポイントがまだありません。" />
        ) : (
          <div className="item-cards-container">
            {checkPoints.map((cp, index) => (
              <div
                key={index}
                ref={(el) => {
                  checkPointRefs.current[index] = el;
                }}
              >
                <CheckPoint
                  checkPoint={cp}
                  setCheckPoints={setCheckPoints}
                  isClosest={cp.id === closestCheckPointId}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CheckPoints;
