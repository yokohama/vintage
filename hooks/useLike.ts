"use client";

import { useState } from "react";
import { toast } from "sonner";
import { checkPointsAPI } from "@/lib/api/supabase/checkPointsAPI";
import { useUserProfile } from "@/contexts/ProfileContext";

export function useLike() {
  const { userProfile } = useUserProfile();
  const [isLoading, setIsLoading] = useState(false);

  const handleLike = async (
    checkPointId: number,
    currentIsLiked: boolean,
    currentLikeCount: number = 0,
  ) => {
    if (!userProfile) {
      toast.error("ログインが必要です");
      return null;
    }

    setIsLoading(true);

    try {
      if (currentIsLiked) {
        // いいねを取り消す
        await checkPointsAPI.unlikeCheckPoint(checkPointId, userProfile.id);

        return {
          isLiked: false,
          likeCount: Math.max(0, currentLikeCount - 1), // 現在のカウントから1減らす（最小値は0）
        };
      } else {
        // いいねする
        await checkPointsAPI.likeCheckPoint(checkPointId, userProfile.id);

        return {
          isLiked: true,
          likeCount: currentLikeCount + 1, // 現在のカウントに1追加
        };
      }
    } catch (error) {
      console.error("いいね処理に失敗しました:", error);
      toast.error("いいね処理に失敗しました");
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    handleLike,
    isLoading,
  };
}

export default useLike;
