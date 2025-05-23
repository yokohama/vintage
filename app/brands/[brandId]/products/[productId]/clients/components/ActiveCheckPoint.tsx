"use client";

import Image from "next/image";
import { CheckPointType } from "@/lib/types";
import { Trash2 } from "lucide-react";
import CheckPointFooter from "./CheckPointFooter";

interface ActiveCheckPointProps {
  checkPoint: CheckPointType;
  setCheckPoints: React.Dispatch<React.SetStateAction<CheckPointType[]>>;
  isOwnCheckPoint: boolean;
  liked: boolean;
  likeCount: number;
  isLikeLoading: boolean;
  handleShare: (e: React.MouseEvent) => void;
  handleLike: (e: React.MouseEvent) => void;
  handleDelete: (
    checkPointId: number,
    e: React.MouseEvent,
    setCheckPoints: React.Dispatch<React.SetStateAction<CheckPointType[]>>,
  ) => void;
}

const ActiveCheckPoint = ({
  checkPoint,
  setCheckPoints,
  isOwnCheckPoint,
  liked,
  likeCount,
  isLikeLoading,
  handleShare,
  handleLike,
  handleDelete,
}: ActiveCheckPointProps) => {
  return (
    <div className="p-4 transition-colors duration-300 bg-amber-500 border-2 border-black">
      {isOwnCheckPoint && (
        <button
          onClick={(e) => handleDelete(checkPoint.id, e, setCheckPoints)}
          aria-label="削除"
        >
          <Trash2 size={18} />
        </button>
      )}
      <div>
        {checkPoint.imageUrl && (
          <div className="relative h-16 w-16 mr-3 flex-shrink-0 rounded-sm overflow-hidden">
            <Image
              src={checkPoint.imageUrl}
              alt={checkPoint.point || "チェックポイント画像"}
              fill
              sizes="(max-width: 768px) 100vw, 64px"
              className="object-cover sepia-[0.15] brightness-[0.98]"
              priority={true}
            />
          </div>
        )}
        <div>
          <h4>{checkPoint.point}</h4>
          <p>{checkPoint.description}</p>
        </div>
      </div>
      <CheckPointFooter
        checkPoint={checkPoint}
        liked={liked}
        likeCount={likeCount}
        isLikeLoading={isLikeLoading}
        handleLike={handleLike}
        handleShare={handleShare}
      />
    </div>
  );
};

export default ActiveCheckPoint;
