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
    <div className="mt-4 pt-3 border-t border-amber-100 bg-amber-100 p-3 rounded-b-lg">
      <div className="flex justify-between items-center">
        {/* 投稿者情報 - クリックでプロフィールページへ */}
        <Link
          href={`/profile/${checkPoint.profile?.id}`}
          onClick={(e) => e.stopPropagation()} // 親要素のクリックイベントを停止
          className="flex items-center gap-2 hover:text-amber-800 transition-colors"
        >
          <div className="flex-shrink-0 w-6 h-6 rounded-full overflow-hidden border border-amber-200">
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
          <span className="text-sm text-stone-600 hover:text-amber-800 transition-colors">
            {checkPoint.profile?.displayName}
          </span>
        </Link>

        {/* インタラクションボタン */}
        <div className="flex items-center gap-4">
          <button
            onClick={(e) => {
              e.stopPropagation(); // 親要素のクリックイベントを停止
              handleLike(e);
            }}
            className={`flex items-center text-xs text-stone-600 ${liked ? "text-amber-700" : ""} hover:text-amber-800 transition-colors ${isLikeLoading ? "opacity-50 cursor-wait" : ""}`}
            aria-label="いいね"
            disabled={isLikeLoading}
          >
            <Heart
              size={14}
              className={liked ? "fill-amber-700 stroke-0" : ""}
            />
            <span className="ml-1">{likeCount}</span>
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation(); // 親要素のクリックイベントを停止
              handleShare(e);
            }}
            className="text-stone-600 hover:text-amber-800 transition-colors"
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
