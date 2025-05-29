"use client";

import { useState, useEffect, useCallback } from "react";

import Header from "@/components/ui/Header";
import PageTitle from "@/components/ui/PageTitle";
import Spinner from "@/components/ui/Spinner";
import Error from "@/components/ui/Error";
import NotFound from "@/components/ui/NotFound";
import { ApiErrorType, CheckPointType, UserProfileType } from "@/lib/types";
import { userProfilesAPI } from "@/lib/api/supabase/userProfilesAPI";
import { useCheckPoint } from "@/hooks/useCheckPoint";
import Link from "next/link";
import Image from "next/image";
import { Heart, Share2 } from "lucide-react";
import { siteConfig } from "@/lib/config/siteConfig";

// カスタムのLikeCheckPointコンポーネント（お気に入り一覧専用）
const LikeCheckPoint = ({
  checkPoint,
  onUnlike,
}: {
  checkPoint: CheckPointType;
  onUnlike: (checkPointId: string) => void;
}) => {
  // 各チェックポイントごとに独自のキーを使用して状態を分離
  const { isLikeLoading, handleShare, handleLike, isLiked, likeCount } =
    useCheckPoint({
      checkPoint,
    });

  // いいねボタンのカスタムハンドラー
  const handleLikeWithRemove = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation(); // イベントの伝播を確実に停止

    // いいね操作前の状態を確認
    const wasLiked = isLiked;
    const currentCheckPointId = checkPoint.id;
    console.log("いいね操作前:", wasLiked, currentCheckPointId);

    try {
      // いいね操作を実行
      await handleLike(e);

      // いいねが解除された場合のみ処理
      if (wasLiked) {
        console.log("いいね解除処理:", currentCheckPointId);
        // 特定のチェックポイントIDを指定して削除
        onUnlike(String(currentCheckPointId));
      }
    } catch (error) {
      console.error("いいね処理中にエラーが発生しました:", error);
    }
  };

  return (
    <div className="checkpoint-card-container">
      <div className="checkpoint-card-image-container">
        {checkPoint.point && (
          <div className="checkpoint-active-card-point">{checkPoint.point}</div>
        )}
        <Image
          src={checkPoint.imageUrl}
          alt={checkPoint.point || "チェックポイント画像"}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
          className="checkpoint-card-image"
          priority={true}
        />
      </div>
      <div className="checkpoint-card-body-container">
        <p className="checkpoint-card-body-description">
          {checkPoint.description}
        </p>
      </div>
      <div className="checkpoint-active-card-footer-container">
        <Link
          href={`/profiles/${checkPoint.profile?.id}`}
          onClick={(e) => e.stopPropagation()}
          className="checkpoint-active-card-footer-profile-container"
        >
          <Image
            src={
              checkPoint.profile?.avatarUrl ||
              siteConfig.images.defaultProfileAvatar
            }
            alt={checkPoint.profile?.displayName || "ユーザー"}
            width={32}
            height={32}
            unoptimized={
              checkPoint.profile?.avatarUrl?.includes("api.dicebear.com") ||
              false
            }
            className="checkpoint-active-card-footer-profile-image"
          />
          <span className="checkpoint-active-card-footer-profile-name">
            {checkPoint.profile?.displayName}
          </span>
        </Link>

        {/* SNS */}
        <div className="checkpoint-active-card-footer-sns-container">
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleLikeWithRemove(e);
            }}
            className={`checkpoint-active-card-footer-sns-button ${
              isLiked ? "text-amber-700" : ""
            } ${isLikeLoading ? "opacity-50 cursor-wait" : ""}`}
            aria-label="いいね"
            disabled={isLikeLoading}
          >
            <Heart
              className={
                isLiked ? "checkpoint-active-card-footer-sns-liked-heart" : ""
              }
            />
            <span className="ml-1">{likeCount}</span>
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleShare(e);
            }}
            className="checkpoint-active-card-footer-sns-button"
            aria-label="シェア"
          >
            <Share2 />
          </button>
        </div>
      </div>
    </div>
  );
};

// カスタムのLikeCheckPointsコンポーネント（お気に入り一覧専用）
const LikeCheckPoints = ({
  checkPoints,
  onUnlike,
}: {
  checkPoints: CheckPointType[];
  onUnlike: (checkPointId: string) => void;
}) => {
  return (
    <div className="checkpoint-cards-container">
      {checkPoints.map((cp) => (
        // インデックスではなく、一意のIDをキーとして使用
        <div key={`checkpoint-${cp.id}`}>
          <LikeCheckPoint checkPoint={cp} onUnlike={onUnlike} />
        </div>
      ))}
    </div>
  );
};

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

  // いいね解除時にチェックポイントを一覧から削除する関数
  const handleUnlike = useCallback((checkPointId: string) => {
    console.log("削除対象ID:", checkPointId, typeof checkPointId);
    // 数値に変換
    const checkPointIdNum = parseInt(checkPointId, 10);
    console.log("変換後ID:", checkPointIdNum, typeof checkPointIdNum);

    // 状態更新を確実に行うため、関数形式で更新
    setCheckPoints((prev) => {
      // 削除前のチェックポイント一覧をログ出力
      console.log(
        "削除前のチェックポイント一覧:",
        JSON.stringify(prev.map((cp) => ({ id: cp.id, type: typeof cp.id }))),
      );

      // フィルタリング処理 - 特定のIDのみを削除
      const filtered = prev.filter((cp) => {
        // 型変換を確実に行う
        const cpId = Number(cp.id);
        const result = cpId !== checkPointIdNum;
        console.log(
          "比較:",
          cpId,
          typeof cpId,
          "vs",
          checkPointIdNum,
          typeof checkPointIdNum,
          "結果:",
          result,
        );
        return result;
      });

      console.log(
        "フィルター前:",
        prev.length,
        "フィルター後:",
        filtered.length,
        "削除されたか:",
        prev.length !== filtered.length,
      );

      // 新しい配列を返す
      return [...filtered];
    });
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
          <LikeCheckPoints checkPoints={checkPoints} onUnlike={handleUnlike} />
        )}
      </div>
    </main>
  );
}
