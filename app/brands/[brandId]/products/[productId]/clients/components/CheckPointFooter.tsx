"use client";

import Image from "next/image";
import Link from "next/link";
import { CheckPointType } from "@/lib/types";
import { Heart, Share2 } from "lucide-react";
import { siteConfig } from "@/lib/config/siteConfig";

interface CheckPointFooterProps {
  checkPoint: CheckPointType;
  liked: boolean;
  likeCount: number;
  isLikeLoading: boolean;
  handleShare: (e: React.MouseEvent) => void;
  handleLike: (e: React.MouseEvent) => void;
}

const CheckPointFooter = ({
  checkPoint,
  liked,
  likeCount,
  isLikeLoading,
  handleLike,
  handleShare,
}: CheckPointFooterProps) => {
  return (
    <div className="checkpoint-active-card-footer-container">
      <Link
        href={`/profile/${checkPoint.profile?.id}`}
        onClick={(e) => e.stopPropagation()} // 親要素のクリックイベントを停止
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
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleLike(e);
          }}
          className={`checkpoint-active-card-footer-sns-button ${liked ? "text-amber-700" : "opacity-50 cursor-wait"} ${isLikeLoading ? "" : ""}`}
          aria-label="いいね"
          disabled={isLikeLoading}
        >
          <Heart
            className={
              liked ? "checkpoint-active-card-footer-sns-liked-heart" : ""
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
  );
};

export default CheckPointFooter;
