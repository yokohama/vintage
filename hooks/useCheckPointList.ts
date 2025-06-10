"use client";

import { useEffect, useState, useCallback, useMemo } from "react";

import { siteConfig } from "@/lib/config/siteConfig";
import { useAuth } from "@/contexts/AuthContext";
import { checkPointsAPI } from "@/lib/api/supabase/checkPointsAPI";
import { CheckPointType } from "@/lib/types";

type CheckPointListProps = {
  brandId: number | null;
  brandName: string | null;
  productId: number | null;
  productName: string | null;
  vintageId: number | null;
  vintageName: string | null;
  profileId: string | null;
  profileName: string | null;
  likedUserId: string | null;
  likedUserName: string | null;
};

export const useCheckPointList = ({
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
}: CheckPointListProps) => {
  const { user } = useAuth();

  const [pageTitle, setPageTitle] = useState<string>("");
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [cpStatusChangeCount, setCpStatusChangeCount] = useState<number>(0);
  const [initialCheckPoints, setInitialCheckPoints] = useState<
    CheckPointType[]
  >([]);
  const [initialError, setInitialError] = useState<unknown | null>(null);
  const [initialLoading, setInitialLoading] = useState(true);
  const [isLastCardActive, setIsLastCardActive] = useState<boolean>(false);

  // 基本の取得関数
  const fetchCheckPoints = useCallback(
    (page: number, pageSize: number) =>
      checkPointsAPI.getCheckPoints(user?.id, page, pageSize),
    [user?.id],
  );

  // 自分がいいねしているものの取得
  // likedUserIdがセットされていない場合は空文字をいれて検索に引っかからないようにする。
  const fetchCheckPointsByLikedUserId = useCallback(
    (page: number, pageSize: number) =>
      checkPointsAPI.getCheckPointsByLied(likedUserId || "", page, pageSize),
    [likedUserId],
  );

  // vintageId 指定時の取得関数
  const fetchCheckPointsByVintageId = useCallback(
    (page: number, pageSize: number) =>
      vintageId
        ? checkPointsAPI.getCheckPointsByVintageId(
            vintageId,
            user?.id,
            page,
            pageSize,
          )
        : Promise.resolve([]),
    [vintageId, user?.id],
  );

  // profileId 指定時の取得関数
  const fetchCheckPointsByProfileId = useCallback(
    (page: number, pageSize: number) =>
      profileId
        ? checkPointsAPI.getCheckPointsByProfileId(
            profileId,
            user?.id,
            page,
            pageSize,
          )
        : Promise.resolve([]),
    [profileId, user?.id],
  );

  // 条件に合わせてfetchFunctionをセット
  const fetchFunction = useMemo(() => {
    if (profileId) {
      return fetchCheckPointsByProfileId;
    }
    if (vintageId) {
      return fetchCheckPointsByVintageId;
    }
    if (likedUserId) {
      return fetchCheckPointsByLikedUserId;
    }
    return fetchCheckPoints;
  }, [
    profileId,
    vintageId,
    likedUserId,
    fetchCheckPoints,
    fetchCheckPointsByVintageId,
    fetchCheckPointsByProfileId,
    fetchCheckPointsByLikedUserId,
  ]);

  // タイトル更新
  useEffect(() => {
    if (profileName) {
      setPageTitle(`${profileName}さんの鑑定ポイント一覧`);
    } else if (likedUserId) {
      setPageTitle(`お気に入り鑑定ポイント一覧`);
    } else {
      let title = "全て";
      if (brandName) {
        title = title + brandName;
      }
      if (productName) {
        title = `${title} / ${productName}`;
      }
      if (vintageName) {
        title = `${title} / ${vintageName}`;
      }
      if (title === "") {
        title = "全て";
      }
      const fixedTitle = title.replace(/^\s\/\s/, "");
      setPageTitle(`${fixedTitle}の鑑定ポイント一覧`);
    }
  }, [
    brandName,
    productName,
    vintageName,
    profileName,
    likedUserId,
    likedUserName,
  ]);

  // 初期データ取得
  useEffect(() => {
    const fetchInitial = async () => {
      try {
        const data = await fetchFunction(
          1,
          siteConfig.pagination.checkPoints.itemsPerPage,
        );
        setInitialCheckPoints(data);
      } catch (err) {
        console.error("初期データ取得エラー:", err);
        setInitialError(err);
      } finally {
        setInitialLoading(false);
      }
    };
    fetchInitial();
  }, [fetchFunction]);

  // スクロールで activeIndex 更新
  useEffect(() => {
    const handleScroll = () => {
      const pageTitleEl = document.querySelector(".page-title-container");
      if (!pageTitleEl) return;
      const bottom = pageTitleEl.getBoundingClientRect().bottom;
      const cards = document.querySelectorAll(".checkpoint-card-container");

      // 最後のカードのインデックス
      const lastCardIndex = cards.length - 1;

      // 最後のカードの場合の特別処理
      if (isLastCardActive) {
        // 最後から2番目のカードの位置をチェック
        if (lastCardIndex > 0) {
          const secondLastCard = cards[lastCardIndex - 1];
          // 1つ前のカードが表示領域に入ったら、最後のカードのアクティブ状態を解除
          if (secondLastCard.getBoundingClientRect().top >= bottom) {
            setActiveIndex(lastCardIndex - 1);
            setIsLastCardActive(false);
            return;
          }
        }
        // それ以外の場合は最後のカードをアクティブに保持
        return;
      }

      // 通常の処理（最後のカードがアクティブでない場合）
      setActiveIndex(null);
      for (let i = 0; i < cards.length; i++) {
        const isLastCard = i === lastCardIndex;
        if (cards[i].getBoundingClientRect().top >= bottom) {
          setActiveIndex(i);
          // 最後のカードがアクティブになった場合、フラグを設定
          if (isLastCard) {
            setIsLastCardActive(true);
          }
          break;
        }
      }
    };

    const initTimeout = setTimeout(handleScroll, 100);
    window.addEventListener("scroll", handleScroll);
    return () => {
      clearTimeout(initTimeout);
      window.removeEventListener("scroll", handleScroll);
    };
  }, [brandId, productId, vintageId, activeIndex, isLastCardActive]);

  // 状態更新後に再フェッチトリガー
  const onStateChangeSuccess = () => {
    setCpStatusChangeCount((prev) => prev + 1);
  };

  return {
    pageTitle,
    initialCheckPoints,
    initialLoading,
    initialError,
    activeIndex,
    onStateChangeSuccess,
    fetchFunction,
    cpStatusChangeCount,
  };
};
