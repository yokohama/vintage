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
  const [isLikeLoading, setIsLikeLoading] = useState(false);
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
      if (isLiked) {
        // いいねを取り消す
        await checkPointsAPI.unlikeCheckPoint(
          checkPoint.id,
          currentUserProfile.id,
        );
        setIsLiked(false);
        setLikeCount((prev) => Math.max(0, prev - 1)); // いいね数を減らす（0未満にならないよう制限）

        // 親コンポーネントの状態も更新
        if (setCheckPoints) {
          setCheckPoints((prev) =>
            prev.map((cp) =>
              cp.id === checkPoint.id
                ? {
                    ...cp,
                    isLiked: false,
                    likeCount: Math.max(0, (cp.likeCount || 0) - 1),
                  }
                : cp,
            ),
          );
        }
      } else {
        // いいねする
        await checkPointsAPI.likeCheckPoint(
          checkPoint.id,
          currentUserProfile.id,
        );
        setIsLiked(true);
        setLikeCount((prev) => prev + 1); // いいね数を増やす

        // 親コンポーネントの状態も更新
        if (setCheckPoints) {
          setCheckPoints((prev) =>
            prev.map((cp) =>
              cp.id === checkPoint.id
                ? {
                    ...cp,
                    isLiked: true,
                    likeCount: (cp.likeCount || 0) + 1,
                  }
                : cp,
            ),
          );
        }
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
    isOverSm,
    isOwnCheckPoint,
    isLikeLoading,
    handleShare,
    handleLike,
    handleDelete,
    isLiked,
    setIsLiked,
    likeCount,
  };
};

export default useCheckPoint;
