"use client";

import Link from "next/link";
import Image from "next/image";
import { Share2 } from "lucide-react";
import { siteConfig } from "@/lib/config/siteConfig";
import { CheckPointType } from "@/lib/types";
import { useCheckPoint } from "@/hooks/useCheckPoint";
import LikeButton from "./like/LikeButton";

interface CheckPointFooterProps {
  checkPoint: CheckPointType;
  setCheckPoints?: React.Dispatch<React.SetStateAction<CheckPointType[]>>;
}

export const CheckPointFooter = ({
  checkPoint,
  setCheckPoints,
}: CheckPointFooterProps) => {
  const { isLikeLoading, handleShare, handleLike, isLiked, likeCount } =
    useCheckPoint({
      checkPoint,
      setCheckPoints,
    });

  const handleLikeChange = (isLiked: boolean, likeCount: number) => {
    // 親コンポーネントの状態も更新
    if (setCheckPoints) {
      setCheckPoints((prev) =>
        prev.map((cp) =>
          cp.id === checkPoint.id
            ? {
                ...cp,
                isLiked,
                likeCount,
              }
            : cp,
        ),
      );
    }
  };

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
          isLiked={isLiked || false}
          likeCount={likeCount}
          onLikeChange={handleLikeChange}
          disabled={isLikeLoading}
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
