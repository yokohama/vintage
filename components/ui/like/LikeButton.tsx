"use client";

import { Heart } from "lucide-react";
import { useLike } from "@/hooks/useLike";

interface LikeButtonProps {
  checkPointId: number;
  isLiked: boolean;
  likeCount: number;
  onLikeChange?: (isLiked: boolean, likeCount: number) => void;
  className?: string;
  disabled?: boolean;
}

export function LikeButton({
  checkPointId,
  isLiked,
  likeCount,
  onLikeChange,
  className = "",
  disabled = false,
}: LikeButtonProps) {
  const { handleLike, isLoading } = useLike();

  const handleLikeClick = async (e: React.MouseEvent) => {
    e.stopPropagation(); // イベントの伝播を停止

    if (isLoading || disabled) return;

    const result = await handleLike(checkPointId, isLiked, likeCount);
    if (result && onLikeChange) {
      onLikeChange(result.isLiked, result.likeCount);
    }
  };

  return (
    <button
      onClick={handleLikeClick}
      disabled={isLoading || disabled}
      className={`checkpoint-active-card-footer-sns-button ${
        isLiked ? "text-amber-700" : ""
      } ${isLoading ? "opacity-50 cursor-wait" : ""} ${className}`}
      aria-label={isLiked ? "いいねを取り消す" : "いいねする"}
    >
      <Heart
        className={
          isLiked ? "checkpoint-active-card-footer-sns-liked-heart" : ""
        }
      />
      <span className="ml-1">{likeCount}</span>
    </button>
  );
}

export default LikeButton;
