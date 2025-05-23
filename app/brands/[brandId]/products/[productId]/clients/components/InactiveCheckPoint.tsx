"use client";

import Image from "next/image";
import { CheckPointType } from "@/lib/types";
import CheckPointFooter from "./CheckPointFooter";
import OwnCheckPoint from "./OwnCheckPoint";

// 文字列を指定の長さでカットして省略記号を追加する関数
const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + "...";
};

interface InactiveCheckPointProps {
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

const InactiveCheckPoint = ({
  checkPoint,
  setCheckPoints,
  isOwnCheckPoint,
  liked,
  likeCount,
  isLikeLoading,
  handleShare,
  handleLike,
  handleDelete,
}: InactiveCheckPointProps) => {
  return (
    <div className="checkpoint-inactive-card-container">
      <div className="checkpoint-inactive-card-body">
        {checkPoint.imageUrl && (
          <div
            className="checkpoint-inactive-card-image-container"
            style={{ position: "relative", width: "64px", height: "64px" }}
          >
            <Image
              src={checkPoint.imageUrl}
              alt={checkPoint.point || "チェックポイント画像"}
              fill
              className="checkpoint-inactive-card-image"
              sizes="64px"
              priority={true}
            />
          </div>
        )}
        <div className="flex-1">
          <p className="checkpoint-inactive-card-description">
            {truncateText(checkPoint.description, 50)}
          </p>
        </div>
        <div className="flex-shrink-0 w-auto">
          <OwnCheckPoint
            checkPoint={checkPoint}
            setCheckPoints={setCheckPoints}
            isOwnCheckPoint={isOwnCheckPoint}
            handleDelete={handleDelete}
          />
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

export default InactiveCheckPoint;
