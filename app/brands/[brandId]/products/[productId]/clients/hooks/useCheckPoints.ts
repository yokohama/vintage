"use client";

import { useState, useEffect } from "react";
import { CheckPointType, UserProfileType, VintageType } from "@/lib/types";
import { User } from "@supabase/supabase-js";
import { userProfilesAPI } from "@/lib/api/supabase/userProfilesAPI";
import { useAuth } from "@/contexts/AuthContext";
import { useInfiniteScroll } from "@/contexts/InfiniteScrollContext";
import { checkPointsAPI } from "@/lib/api/supabase/checkPointsAPI";
import { usePageTitle } from "@/contexts/PageTitleContext";

interface UseCheckPointsReturn {
  checkPoints: CheckPointType[];
  setCheckPoints: React.Dispatch<React.SetStateAction<CheckPointType[]>>;
  userProfiles: Record<string, UserProfileType>;
  isAddModalOpen: boolean;
  setIsAddModalOpen: (isOpen: boolean) => void;
  handleAddButtonClick: () => void;
  user: User | null;
  addNewCheckPoint: (newCheckPoint: CheckPointType) => void;
  loading: boolean;
  error: boolean;
  activeIndex: number | null;
}

export function useCheckPoints(
  vintage: VintageType,
  itemsPerPage: number,
): UseCheckPointsReturn {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [checkPoints, setCheckPoints] = useState<CheckPointType[]>(
    vintage.checkPoints,
  );
  const [userProfiles, setUserProfiles] = useState<
    Record<string, UserProfileType>
  >({});

  const { user, signInWithGoogle } = useAuth();
  const { setHasMore } = useInfiniteScroll();
  const [error, setError] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const { isFixed } = usePageTitle();
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [lastCheckPointLocked, setLastCheckPointLocked] =
    useState<boolean>(false);

  useEffect(() => {
    const fetchCheckPoints = async () => {
      try {
        setLoading(true);
        const checkPointsData = await checkPointsAPI.getCheckPointsByVintageId(
          vintage.id,
          undefined,
          1,
          itemsPerPage,
        );
        setCheckPoints(checkPointsData);

        // 取得したデータが1ページ分より少なければ、もうデータがないと判断
        if (checkPointsData.length < itemsPerPage) {
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
  }, [vintage.id, setHasMore, itemsPerPage]);

  // 追加ボタンクリックハンドラー
  const handleAddButtonClick = () => {
    if (!user) {
      // ユーザーがログインしていない場合は、Googleログイン処理を実行
      signInWithGoogle();
    } else {
      // ログイン済みの場合はモーダルを開く
      setIsAddModalOpen(true);
    }
  };

  // 新しい鑑定ポイントを追加するメソッド
  const addNewCheckPoint = (newCheckPoint: CheckPointType) => {
    setCheckPoints((prevCheckPoints) => [newCheckPoint, ...prevCheckPoints]);

    // 新しい鑑定ポイントのユーザープロフィールを取得
    if (newCheckPoint.profile?.id && !userProfiles[newCheckPoint.profile.id]) {
      userProfilesAPI
        .getCurrentUserProfile()
        .then((profile: UserProfileType) => {
          if (profile) {
            setUserProfiles((prev) => ({
              ...prev,
              [newCheckPoint.profile?.id as string]: profile,
            }));
          }
        });
    }
  };

  // 鑑定ポイントの投稿者情報を取得
  useEffect(() => {
    const fetchUserProfiles = async () => {
      const userIds = checkPoints
        .map((cp) => cp.profile?.id)
        .filter(
          (userId): userId is string => userId !== null && userId !== undefined,
        );

      // 重複を排除
      const uniqueUserIds = Array.from(new Set(userIds));

      // 各ユーザーのプロフィール情報を取得
      const profiles: Record<string, UserProfileType> = {};

      await Promise.all(
        uniqueUserIds.map(async (userId) => {
          const profile = await userProfilesAPI.getUserProfile(userId);
          if (profile) {
            profiles[userId] = profile;
          }
        }),
      );

      setUserProfiles(profiles);
    };

    if (checkPoints.length > 0) {
      fetchUserProfiles();
    }
  }, [checkPoints]);

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

  return {
    checkPoints,
    setCheckPoints,
    userProfiles,
    isAddModalOpen,
    setIsAddModalOpen,
    handleAddButtonClick,
    user,
    addNewCheckPoint,
    loading,
    error,
    activeIndex,
  };
}
