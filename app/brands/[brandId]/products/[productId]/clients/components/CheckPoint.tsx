"use client";

import Image from "next/image";
import { CheckPointType } from "@/lib/types";
import CheckPointFooter from "./CheckPointFooter";
import OwnCheckPoint from "./OwnCheckPoint";
import { useCheckPoint } from "../hooks/useCheckPoint";

interface CheckPointProps {
  checkPoint: CheckPointType;
  setCheckPoints: React.Dispatch<React.SetStateAction<CheckPointType[]>>;
  isActive: boolean;
}

const CheckPoint = ({
  checkPoint,
  setCheckPoints,
  isActive,
}: CheckPointProps) => {
  const {
    isOwnCheckPoint,
    liked,
    likeCount,
    isLikeLoading,
    handleShare,
    handleLike,
    handleDelete,
  } = useCheckPoint(checkPoint, false);

  const containerClass = isActive
    ? "checkpoint-active-card-container"
    : "checkpoint-inactive-card-container";

  const bodyClass = isActive
    ? "checkpoint-active-card-body"
    : "checkpoint-inactive-card-body";

  const imageContainerClass = isActive
    ? "checkpoint-active-card-image-container"
    : "checkpoint-inactive-card-image-container";

  const imageClass = isActive
    ? "checkpoint-active-card-image"
    : "checkpoint-inactive-card-image";

  const descriptionClass = isActive
    ? "checkpoint-active-card-description"
    : "checkpoint-inactive-card-description";

  console.log(`CheckPoint rendering: ${checkPoint.id}, isActive: ${isActive}`);
  return (
    <div className={containerClass}>
      <div className={isActive ? "" : "flex items-start"}>
        <div
          className={imageContainerClass}
          style={{
            position: "relative",
          }}
        >
          {isActive && (
            <h3 className="checkpoint-active-card-point">{checkPoint.point}</h3>
          )}
          <Image
            src={checkPoint.imageUrl}
            alt={checkPoint.point || "チェックポイント画像"}
            fill
            className={imageClass}
            priority={true}
          />
        </div>
        <div className={bodyClass}>
          <div className="relative w-full">
            <p className={`${descriptionClass} description-container`}>
              {checkPoint.description}
            </p>
          </div>
          {isActive && (
            <div className="flex justify-end w-full">
              <OwnCheckPoint
                checkPoint={checkPoint}
                setCheckPoints={setCheckPoints}
                isOwnCheckPoint={isOwnCheckPoint}
                handleDelete={handleDelete}
              />
            </div>
          )}
        </div>

        {isActive && (
          <CheckPointFooter
            checkPoint={checkPoint}
            liked={liked}
            likeCount={likeCount}
            isLikeLoading={isLikeLoading}
            handleLike={handleLike}
            handleShare={handleShare}
          />
        )}
      </div>
    </div>
  );
};

export default CheckPoint;
