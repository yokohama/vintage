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
    <div>
      <div>
        {/* 投稿者情報 - クリックでプロフィールページへ */}
        <Link
          href={`/profile/${checkPoint.profile?.id}`}
          onClick={(e) => e.stopPropagation()} // 親要素のクリックイベントを停止
        >
          <div className="flex-shrink-0 w-6 h-6 rounded-full overflow-hidden">
            <Image
              src={
                checkPoint.profile?.avatarUrl ||
                siteConfig.images.defaultProfileAvatar
              }
              alt={checkPoint.profile?.displayName || "ユーザー"}
              width={24}
              height={24}
              className="object-cover w-full h-full"
              unoptimized={
                checkPoint.profile?.avatarUrl?.includes("api.dicebear.com") ||
                false
              }
            />
          </div>
          <span className="">{checkPoint.profile?.displayName}</span>
        </Link>

        {/* インタラクションボタン */}
        <div className="">
          <button
            onClick={(e) => {
              e.stopPropagation(); // 親要素のクリックイベントを停止
              handleLike(e);
            }}
            className={`flex items-center text-xs ${liked ? "" : ""} hover:oldies-text-accent transition-colors ${isLikeLoading ? "opacity-50 cursor-wait" : ""}`}
            aria-label="いいね"
            disabled={isLikeLoading}
          >
            <Heart size={14} className={liked ? "" : ""} />
            <span className="ml-1">{likeCount}</span>
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation(); // 親要素のクリックイベントを停止
              handleShare(e);
            }}
            className=""
            aria-label="シェア"
          >
            <Share2 size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CheckPointFooter;
