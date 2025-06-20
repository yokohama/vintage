"use client";

import Image from "next/image";
import Link from "next/link";
import { Share2 } from "lucide-react";
import { CheckPointType } from "@/lib/types";
import { useCheckPoint } from "@/hooks/useCheckPoint";
import LikeButton from "@/components/ui/like/LikeButton";
import { siteConfig } from "@/lib/config/siteConfig";

interface CheckPointFooterProps {
  checkPoint: CheckPointType;
  onLikeSuccess?: () => void;
}

const CheckPointFooter = ({
  checkPoint,
  onLikeSuccess,
}: CheckPointFooterProps) => {
  const { handleShare } = useCheckPoint({
    checkPoint,
  });

  return (
    <div className="checkpoint-active-card-footer-container">
      <Link
        href={`/profiles/${checkPoint.profile?.id}`}
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
        <LikeButton
          checkPointId={checkPoint.id}
          isLiked={checkPoint.isLiked || false}
          likeCount={checkPoint.likeCount || 0}
          onSuccess={onLikeSuccess}
        />
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
