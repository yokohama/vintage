"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { CheckPointType, UserProfileType } from "@/lib/types";
import { checkPointsAPI } from "@/lib/api/supabase/checkPointsAPI";
import { useUserProfile } from "@/contexts/ProfileContext";

type UseCheckPointProps = {
  checkPoint: CheckPointType;
  setCheckPoints?: React.Dispatch<React.SetStateAction<CheckPointType[]>>;
};

export const useCheckPoint = ({
  checkPoint,
  setCheckPoints,
}: UseCheckPointProps) => {
  const { userProfile: currentUserProfile } = useUserProfile();
  const [profile, setProfile] = useState<UserProfileType | null>(
    checkPoint.profile,
  );
  const [isOwnCheckPoint, setIsOwnCheckPoint] = useState(false);
  const [isLiked, setIsLiked] = useState(checkPoint.isLiked);
  const [likeCount, setLikeCount] = useState(checkPoint.likeCount || 0);

  /*
   * 画面サイズがsm以上ならtrueにする
   */
  const [isOverSm, setIsOverSm] = useState(false);

  // コンポーネントがマウントされた時に画面サイズをチェックし、
  // リサイズイベントでも更新する
  useEffect(() => {
    const checkScreenSize = () => {
      // Tailwindのsmブレークポイントは640px
      setIsOverSm(window.innerWidth >= 640);
    };

    // 初期チェック
    checkScreenSize();

    // リサイズイベントリスナーを追加
    window.addEventListener("resize", checkScreenSize);

    // クリーンアップ関数
    return () => {
      window.removeEventListener("resize", checkScreenSize);
    };
  }, []);

  useEffect(() => {
    if (!checkPoint) return;

    // プロフィール情報の設定
    if (checkPoint.profile) {
      setProfile(checkPoint.profile);
    }

    // 自分の投稿かどうかの判定
    if (currentUserProfile && profile && profile.id === currentUserProfile.id) {
      setIsOwnCheckPoint(true);
    } else {
      setIsOwnCheckPoint(false);
    }
  }, [checkPoint, currentUserProfile, profile]);

  // チェックポイントの削除処理
  const handleDelete = async (checkPointId: number, e: React.MouseEvent) => {
    e.stopPropagation();

    if (!confirm("このチェックポイントを削除してもよろしいですか？")) {
      return;
    }

    try {
      await checkPointsAPI.deleteCheckPoint(checkPointId);

      // 状態を更新して削除したチェックポイントを除外
      if (setCheckPoints) {
        setCheckPoints((prevCheckPoints) =>
          prevCheckPoints.filter((cp) => cp.id !== Number(checkPointId)),
        );
      }

      toast.success("チェックポイントを削除しました");
    } catch (error) {
      console.error("チェックポイントの削除に失敗しました:", error);
      toast.error("チェックポイントの削除に失敗しました");
    }
  };

  // シェア処理
  const handleShare = async (e: React.MouseEvent) => {
    e.stopPropagation();

    if (!checkPoint) return;

    // シェアURLの作成（実際の実装に合わせて調整）
    const shareUrl = `${window.location.origin}/checkpoints/${checkPoint.id}`;

    if (navigator.share) {
      navigator
        .share({
          title: `${checkPoint.point} | Vintage`,
          text: checkPoint.description || "チェックポイントをシェアします",
          url: shareUrl,
        })
        .catch((error) => {
          console.error("シェアに失敗しました:", error);
        });
    } else {
      // クリップボードにコピー
      navigator.clipboard
        .writeText(shareUrl)
        .then(() => toast.success("URLをコピーしました"))
        .catch(() => toast.error("URLのコピーに失敗しました"));
    }
  };

  // いいねの状態を更新する関数
  const updateLikeState = (newIsLiked: boolean, newLikeCount: number) => {
    setIsLiked(newIsLiked);
    setLikeCount(newLikeCount);
  };

  return {
    isOverSm,
    isOwnCheckPoint,
    handleShare,
    handleDelete,
    isLiked,
    setIsLiked,
    likeCount,
    updateLikeState,
  };
};
