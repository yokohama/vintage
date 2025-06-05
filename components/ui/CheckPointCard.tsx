"use client";

import Link from "next/link";
import Image from "next/image";
import { Share2 } from "lucide-react";
import { siteConfig } from "@/lib/config/siteConfig";
import { CheckPointType } from "@/lib/types";
import LikeButton from "./like/LikeButton";

interface CheckPointCardProps {
  checkPoint: CheckPointType;
  onLikeChange?: (checkPointId: number, isLiked: boolean, likeCount: number) => void;
  onRemove?: (checkPointId: number) => void;
  showRemoveButton?: boolean;
  onShare?: (checkPointId: number) => void;
}

export function CheckPointCard({
  checkPoint,
  onLikeChange,
  onRemove,
  showRemoveButton = false,
  onShare,
}: CheckPointCardProps) {
  const handleLikeChange = (isLiked: boolean, likeCount: number) => {
    if (onLikeChange) {
      onLikeChange(checkPoint.id, isLiked, likeCount);
    }
  };

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onShare) {
      onShare(checkPoint.id);
    } else {
      // デフォルトのシェア処理
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
          .then(() => {
            // 成功メッセージはコンポーネント外で処理
            console.log("URLをコピーしました");
          })
          .catch(() => {
            console.error("URLのコピーに失敗しました");
          });
      }
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
              checkPoint.profile?.avatarUrl?.includes("api.dicebear.com") || false
            }
            className="checkpoint-active-card-footer-profile-image"
          />
          <span className="checkpoint-active-card-footer-profile-name">
            {checkPoint.profile?.displayName}
          </span>
        </Link>

        {/* SNS */}
        <div className="checkpoint-active-card-footer-sns-container">
          <LikeButton
            checkPointId={checkPoint.id}
            isLiked={checkPoint.isLiked || false}
            likeCount={checkPoint.likeCount || 0}
            onLikeChange={handleLikeChange}
          />
          <button
            onClick={handleShare}
            className="checkpoint-active-card-footer-sns-button"
            aria-label="シェア"
          >
            <Share2 />
          </button>
          
          {showRemoveButton && onRemove && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onRemove(checkPoint.id);
              }}
              className="text-red-500 text-sm hover:underline"
            >
              削除
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default CheckPointCard;
