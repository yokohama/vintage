import { useState, useEffect } from "react";
import { toast } from "sonner";
import { CheckPointType, UserProfileType } from "@/lib/types";
import { checkPointsAPI } from "@/lib/api/supabase/checkPointsAPI";
import { useUserProfile } from "@/contexts/ProfileContext";

export const useCheckPoint = (
  checkPoint: CheckPointType,
  likedByCurrentUser: boolean,
) => {
  const { userProfile: currentUserProfile } = useUserProfile();
  const [profile, setProfile] = useState<UserProfileType | null>(
    checkPoint.profile,
  );
  const [isOwnCheckPoint, setIsOwnCheckPoint] = useState(false);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
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

    // いいね状態の初期化
    if (likedByCurrentUser !== undefined) {
      setLiked(likedByCurrentUser);
    } else if (checkPoint.isLiked !== undefined) {
      // 代替プロパティとしてisLikedを使用
      setLiked(checkPoint.isLiked);
    }

    // いいね数の初期化
    if (checkPoint.likeCount !== undefined) {
      setLikeCount(checkPoint.likeCount);
    }
  }, [checkPoint, currentUserProfile, profile, likedByCurrentUser]);

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
      if (liked) {
        // いいねを取り消す
        await checkPointsAPI.unlikeCheckPoint(
          checkPoint.id,
          currentUserProfile.id,
        );
        setLiked(false);
        setLikeCount((prev) => Math.max(0, prev - 1));
      } else {
        // いいねする
        await checkPointsAPI.likeCheckPoint(
          checkPoint.id,
          currentUserProfile.id,
        );
        setLiked(true);
        setLikeCount((prev) => prev + 1);
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
    liked,
    likeCount,
    isLikeLoading,
    handleShare,
    handleLike,
    handleDelete,
  };
};
