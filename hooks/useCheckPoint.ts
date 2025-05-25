"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { CheckPointType, UserProfileType } from "@/lib/types";
import { checkPointsAPI } from "@/lib/api/supabase/checkPointsAPI";
import { useUserProfile } from "@/contexts/ProfileContext";

type UseCheckPointProps = {
  checkPoint: CheckPointType;
};

export const useCheckPoint = ({ checkPoint }: UseCheckPointProps) => {
  const { userProfile: currentUserProfile } = useUserProfile();
  const [profile, setProfile] = useState<UserProfileType | null>(
    checkPoint.profile,
  );
  const [isOwnCheckPoint, setIsOwnCheckPoint] = useState(false);
  const [isLikeLoading, setIsLikeLoading] = useState(false);

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
  const handleDelete = async (
    checkPointId: number,
    e: React.MouseEvent,
    setCheckPoints: React.Dispatch<React.SetStateAction<CheckPointType[]>>,
  ) => {
    e.stopPropagation();

    if (!confirm("このチェックポイントを削除してもよろしいですか？")) {
      return;
    }

    try {
      await checkPointsAPI.deleteCheckPoint(checkPointId);

      // 状態を更新して削除したチェックポイントを除外
      setCheckPoints((prevCheckPoints) =>
        prevCheckPoints.filter((cp) => cp.id !== Number(checkPointId)),
      );

      toast.success("チェックポイントを削除しました");
    } catch (error) {
      console.error("チェックポイントの削除に失敗しました:", error);
      toast.error("チェックポイントの削除に失敗しました");
    }
  };

  // いいね処理
  const handleLike = async (e: React.MouseEvent) => {
    e.stopPropagation();

    if (!currentUserProfile || !checkPoint) {
      toast.error("ログインが必要です");
      return;
    }

    setIsLikeLoading(true);

    try {
      if (checkPoint.isLiked) {
        // いいねを取り消す
        console.log("いいね取り消し処理開始");
        await checkPointsAPI.unlikeCheckPoint(
          checkPoint.id,
          currentUserProfile.id,
        );
        console.log("いいね取り消し処理完了");
      } else {
        // いいねする
        console.log("いいね追加処理開始");
        await checkPointsAPI.likeCheckPoint(
          checkPoint.id,
          currentUserProfile.id,
        );
        console.log("いいね追加処理完了");
      }
    } catch (error) {
      console.error("いいね処理に失敗しました:", error);
      toast.error("いいね処理に失敗しました");
    } finally {
      setIsLikeLoading(false);
    }
  };

  // シェア処理
  const handleShare = (e: React.MouseEvent) => {
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

  return {
    isOwnCheckPoint,
    isLikeLoading,
    handleShare,
    handleLike,
    handleDelete,
  };
};

export default useCheckPoint;
