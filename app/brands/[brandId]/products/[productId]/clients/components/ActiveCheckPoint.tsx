"use client";

import Image from "next/image";
import { CheckPointType } from "@/lib/types";
import CheckPointFooter from "./CheckPointFooter";
import OwnCheckPoint from "./OwnCheckPoint";

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
    <div className="checkpoint-active-card-container w-full max-w-full">
      <div className="checkpoint-active-card-body relative flex flex-col w-full p-4">
        {checkPoint.imageUrl && (
          <div
            className="checkpoint-active-card-image-container w-full"
            style={{ position: "relative", height: "200px" }}
          >
            <Image
              src={checkPoint.imageUrl}
              alt={checkPoint.point || "チェックポイント画像"}
              fill
              sizes="100vw"
              className="checkpoint-active-card-image object-cover"
              priority={true}
            />
          </div>
        )}
        <div className="mt-4 w-full">
          <div className="flex justify-between items-center">
            <h3 className="font-medium text-lg">{checkPoint.point}</h3>
            <OwnCheckPoint
              checkPoint={checkPoint}
              setCheckPoints={setCheckPoints}
              isOwnCheckPoint={isOwnCheckPoint}
              handleDelete={handleDelete}
            />
          </div>
          <p className="checkpoint-active-card-description">
            {checkPoint.description}
          </p>
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
