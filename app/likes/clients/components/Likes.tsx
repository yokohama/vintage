"use client";

import { useState, useEffect, useCallback } from "react";

import Header from "@/components/ui/Header";
import PageTitle from "@/components/ui/PageTitle";
import Spinner from "@/components/ui/Spinner";
import Error from "@/components/ui/Error";
import NotFound from "@/components/ui/NotFound";
import CheckPoints from "@/components/ui/CheckPoints";
import { ApiErrorType, CheckPointType, UserProfileType } from "@/lib/types";
import { userProfilesAPI } from "@/lib/api/supabase/userProfilesAPI";

export default function Likes() {
  const [profile, setProfile] = useState<UserProfileType | null>(null);
  const [error, setError] = useState<ApiErrorType | null>(null);
  const [loading, setLoading] = useState(true);
  const [checkPoints, setCheckPoints] = useState<CheckPointType[]>([]);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profileData = await userProfilesAPI.getCurrentUserProfile();
        setProfile(profileData);
        setCheckPoints(profileData.checkPointLikes);
      } catch (err) {
        const apiError = err as Error | ApiErrorType;
        setError({
          message:
            "message" in apiError
              ? apiError.message
              : "プロフィールの取得中にエラーが発生しました",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  // いいね状態変更時の処理
  const handleLikeChange = useCallback((checkPointId: number, isLiked: boolean, likeCount: number) => {
    // いいねが解除された場合は一覧から削除
    if (!isLiked) {
      setCheckPoints((prev) => 
        prev.filter((cp) => cp.id !== checkPointId)
      );
    } else {
      // いいねされた場合は状態を更新
      setCheckPoints((prev) =>
        prev.map((cp) =>
          cp.id === checkPointId
            ? { ...cp, isLiked, likeCount }
            : cp
        )
      );
    }
  }, []);

  return (
    <main>
      <div>
        <Header />
        <PageTitle title="お気入り一覧" />
        {loading ? (
          <Spinner />
        ) : error ? (
          <Error />
        ) : !profile || checkPoints.length === 0 ? (
          <NotFound msg="お気入りが見つかりませんでした。" />
        ) : (
          <CheckPoints 
            checkPoints={checkPoints} 
            onLikeChange={handleLikeChange}
          />
        )}
      </div>
    </main>
  );
}
