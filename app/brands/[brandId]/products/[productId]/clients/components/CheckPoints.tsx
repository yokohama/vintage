"use client";

import { CheckPointType, VintageType } from "@/lib/types";
import AddCheckPointModal from "./AddCheckPointModal";
import { useCheckPoints } from "../hooks/useCheckPoints";
import NotFound from "@/components/ui/NotFound";
import { useEffect, useState } from "react";
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

  useEffect(() => {
    if (!isFixed) {
      // isFixedがfalseの場合、すべてのチェックポイントを非アクティブにする
      const allCheckPointCards = document.querySelectorAll(
        ".checkpoint-inactive-card-container, .checkpoint-active-card-container",
      );

      allCheckPointCards.forEach((card) => {
        card.classList.remove("checkpoint-active-card-container");
        card.classList.add("checkpoint-inactive-card-container");

        // フッターを非表示
        const footer = card.querySelector("#checkPointFooter");
        if (footer) {
          footer.classList.add("hidden");
        }
      });

      return;
    }

    const handleScroll = () => {
      const pageTitleElement = document.querySelector(".page-title-container");
      if (!pageTitleElement) return;

      const pageTitleRect = pageTitleElement.getBoundingClientRect();
      const pageTitleBottom = pageTitleRect.bottom;

      // すべてのCheckPointを取得（active と inactive の両方）
      const allCheckPointCards = document.querySelectorAll(
        ".checkpoint-inactive-card-container, .checkpoint-active-card-container",
      );

      // まずすべてのカードをinactiveに戻す
      allCheckPointCards.forEach((card) => {
        card.classList.remove("checkpoint-active-card-container");
        card.classList.add("checkpoint-inactive-card-container");

        // フッターを非表示
        const footer = card.querySelector("#checkPointFooter");
        if (footer) {
          footer.classList.add("hidden");
        }
      });

      // PageTitleと重なっていない最初のcheckPointCardを探す
      for (let i = 0; i < allCheckPointCards.length; i++) {
        const cardRect = allCheckPointCards[i].getBoundingClientRect();

        // このItemがPageTitleと重なっていない（下にある）場合
        if (cardRect.top >= pageTitleBottom) {
          // このItemをactiveに変更
          allCheckPointCards[i].classList.remove(
            "checkpoint-inactive-card-container",
          );
          allCheckPointCards[i].classList.add(
            "checkpoint-active-card-container",
          );

          // フッターを表示
          const footer =
            allCheckPointCards[i].querySelector("#checkPointFooter");
          if (footer) {
            footer.classList.remove("hidden");
          }
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
  }, [isFixed]);

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
      <div className="">
        {checkPoints.length === 0 ? (
          <NotFound msg="鑑定ポイントがまだありません。" />
        ) : (
          <div className="item-cards-container">
            {checkPoints.map((cp, index) => (
              <div key={index}>
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
