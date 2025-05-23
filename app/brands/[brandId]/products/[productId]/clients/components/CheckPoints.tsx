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
    vintage.checkPoints,
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
  }, [vintage]);

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

  // スクロール時に固定されているPageTitleに最も近いCheckPointのIDをログ出力
  useEffect(() => {
    if (!isFixed || !checkPointRefs.current.length) return;

    const handleScroll = () => {
      const pageTitleHeight = 60; // PageTitleの高さを仮定（実際の値に調整してください）
      const pageTitleBottom = pageTitleHeight;

      let closestCheckPoint: CheckPointType | null = null;
      let minDistance = Infinity;

      // 各CheckPointの位置を確認し、PageTitleに最も近いものを見つける
      checkPointRefs.current.forEach((ref, index) => {
        if (ref && index < checkPoints.length) {
          const rect = ref.getBoundingClientRect();
          const distance = Math.abs(rect.top - pageTitleBottom);

          // PageTitleに重なっていない場合
          if (rect.top > pageTitleBottom && distance < minDistance) {
            minDistance = distance;
            closestCheckPoint = checkPoints[index];
          }
        }
      });

      if (closestCheckPoint) {
        setClosestCheckPointId(closestCheckPoint.id);
      } else {
        setClosestCheckPointId(null);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isFixed, checkPoints]);

  return (
    <div>
      <AddCheckPointModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        vintageId={vintage.id}
        onSuccess={(newCheckPoint) => {
          // 新しい鑑定ポイントを状態に追加
          addNewCheckPoint(newCheckPoint);
          setCheckPoints((prevCheckPoints) => [
            ...prevCheckPoints,
            newCheckPoint,
          ]);
          setIsAddModalOpen(false);
        }}
      />

      <div className="mt-6 rounded-sm p-4 shadow-sm">
        <Standerd
          label="追加"
          className="bg-amber-600 hover:bg-amber-700 text-white text-xs"
          onClick={handleAddButtonClick}
        />
      </div>
      <div className="" ref={checkPointsRef}>
        {vintage.checkPoints && vintage.checkPoints.length == 0 ? (
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
