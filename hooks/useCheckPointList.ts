"use client";

import { useEffect, useState, useCallback, useMemo } from "react";

import { siteConfig } from "@/lib/config/siteConfig";
import { useAuth } from "@/contexts/AuthContext";
import { checkPointsAPI } from "@/lib/api/supabase/checkPointsAPI";
import { CheckPointType } from "@/lib/types";

type CheckPointListProps = {
  brandId: number | null;
  brandName: string;
  productId: number | null;
  productName: string;
  vintageId: number | null;
  vintageName: string;
  profileId: string | null;
  profileName: string;
  likedUserId?: string | null;
};

export const useCheckPointList = ({
  brandId,
  productId,
  vintageId,
  vintageName,
  profileId,
  profileName,
  likedUserId,
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
    setPageTitle(
      profileName ? profileName : vintageName ? vintageName : "全て",
    );
  }, [profileName, vintageName]);

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
      setActiveIndex(null);
      for (let i = 0; i < cards.length; i++) {
        if (cards[i].getBoundingClientRect().top >= bottom) {
          setActiveIndex(i);
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
  }, [brandId, productId, vintageId]);

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
