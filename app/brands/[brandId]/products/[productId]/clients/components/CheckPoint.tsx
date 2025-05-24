"use client";

import Image from "next/image";
import { CheckPointType } from "@/lib/types";
import CheckPointFooter from "./CheckPointFooter";
import OwnCheckPoint from "./OwnCheckPoint";
import { useCheckPoint } from "../hooks/useCheckPoint";

interface CheckPointProps {
  checkPoint: CheckPointType;
  setCheckPoints: React.Dispatch<React.SetStateAction<CheckPointType[]>>;
}

const CheckPoint = ({ checkPoint, setCheckPoints }: CheckPointProps) => {
  const {
    isOwnCheckPoint,
    liked,
    likeCount,
    isLikeLoading,
    handleShare,
    handleLike,
    handleDelete,
  } = useCheckPoint(checkPoint, false);

  return (
    <div className="checkpoint-inactive-card-container">
      <div className="checkpoint-inactive-card-body">
        {checkPoint.imageUrl && (
          <div
            className="checkpoint-inactive-card-image-container"
            style={{
              position: "relative",
            }}
          >
            <Image
              src={checkPoint.imageUrl}
              alt={checkPoint.point || "チェックポイント画像"}
              fill
              className="checkpoint-inactive-card-image"
              priority={true}
            />
          </div>
        )}

        <div className="relative w-full">
          <h3 className="checkpoint-point">{checkPoint.point}</h3>
          <div className="absolute top-0 right-0">
            <OwnCheckPoint
              checkPoint={checkPoint}
              setCheckPoints={setCheckPoints}
              isOwnCheckPoint={isOwnCheckPoint}
              handleDelete={handleDelete}
            />
          </div>
          <p className="checkpoint-inactive-card-description description-container">
            {/* アクティブ状態を検出するためのref要素 */}
            {checkPoint.description}
          </p>
        </div>
      </div>

      <div id="checkPointFooter" className="hidden">
        <CheckPointFooter
          checkPoint={checkPoint}
          liked={liked}
          likeCount={likeCount}
          isLikeLoading={isLikeLoading}
          handleLike={handleLike}
          handleShare={handleShare}
        />
      </div>
    </div>
  );
};

export default CheckPoint;
