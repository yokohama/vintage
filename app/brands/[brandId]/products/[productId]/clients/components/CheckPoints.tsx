"use client";

import { CheckPointType, VintageType } from "@/lib/types";
import AddCheckPointModal from "./AddCheckPointModal";
//import ActiveCheckPoint from "./ActiveCheckPoint";
import { useCheckPoints } from "../hooks/useCheckPoints";
import NotFound from "@/components/ui/NotFound";
import { usePageTitle } from "@/contexts/PageTitleContext";
import { useEffect, useRef, useState } from "react";
import { checkPointsAPI } from "@/lib/api/supabase/checkPointsAPI";
import { Standerd } from "@/components/ui/OriginalButton";
import CheckPoint from "./CheckPoint";

interface CheckPointsProps {
  vintage: VintageType;
}

const CheckPoints = ({ vintage }: CheckPointsProps) => {
  const [checkPoints, setCheckPoints] = useState<CheckPointType[]>(
    vintage.checkPoints,
  );

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
  const { isFixed } = usePageTitle();
  const [activeCheckPointIndex, setActiveCheckPointIndex] = useState<
    number | null
  >(null);
  const checkPointsRef = useRef<HTMLDivElement>(null);
  const checkPointRefs = useRef<(HTMLDivElement | null)[]>([]);
  // フッターエリアにスクロールしているかどうかを追跡する状態
  const [isInFooterArea, setIsInFooterArea] = useState(false);

  // スクロール位置に基づいて、一番近いCheckPointを特定する
  useEffect(() => {
    const handleScroll = () => {
      if (!checkPointsRef.current || !vintage.checkPoints?.length) return;

      // PageTitleが固定されていない場合は、activeCheckPointIndexをnullに設定
      if (!isFixed) {
        if (activeCheckPointIndex !== null) {
          setActiveCheckPointIndex(null);
        }
        return;
      }

      // ページ下部に到達したかチェック
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const lastCheckPointIndex = vintage.checkPoints.length - 1;

      // フッターエリアの検出（ドキュメントの最下部から200px以内）
      const isNearFooter = scrollTop + windowHeight >= documentHeight - 200;

      // フッターエリアに入った場合
      if (isNearFooter) {
        if (!isInFooterArea) {
          setIsInFooterArea(true);
        }

        // フッターエリアでは最後のチェックポイントをアクティブにしたままにする
        if (activeCheckPointIndex !== lastCheckPointIndex) {
          setActiveCheckPointIndex(lastCheckPointIndex);
        }
        return;
      } else if (isInFooterArea) {
        // フッターエリアから出た場合
        setIsInFooterArea(false);
      }

      // 通常のスクロール検出ロジック（フッターエリア外の場合）
      // PageTitleが固定されている場合、PageTitleの高さを取得
      const pageTitleHeight =
        document.querySelector(".fixed")?.getBoundingClientRect().height || 0;
      const threshold = pageTitleHeight + 50; // PageTitleの高さ + 余白

      let closestIndex = null;
      let closestDistance = Infinity;

      // 各CheckPointの位置を確認
      checkPointRefs.current.forEach((ref, index) => {
        if (!ref) return;

        const rect = ref.getBoundingClientRect();
        const distance = Math.abs(rect.top - threshold);

        // PageTitleと重なっている場合はスキップ
        if (rect.top < pageTitleHeight) return;

        // 最も近いCheckPointを特定
        if (distance < closestDistance) {
          closestDistance = distance;
          closestIndex = index;
        }
      });

      // 前回と同じインデックスの場合は更新しない
      if (closestIndex !== activeCheckPointIndex) {
        setActiveCheckPointIndex(closestIndex);
      }
    };

    window.addEventListener("scroll", handleScroll);

    // 初期表示時には、isFixedがfalseの場合はactiveCheckPointIndexをnullに設定
    if (!isFixed) {
      setActiveCheckPointIndex(null);
    } else {
      // PageTitleが固定されている場合のみ初期実行
      handleScroll();
    }

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [isFixed, vintage.checkPoints, /*activeCheckPointIndex,*/ isInFooterArea]);

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
                ref={(el) => (checkPointRefs.current[index] = el)}
              >
                <CheckPoint checkPoint={cp} setCheckPoints={setCheckPoints} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CheckPoints;
