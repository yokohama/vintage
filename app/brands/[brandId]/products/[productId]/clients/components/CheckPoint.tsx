"use client";

import Image from "next/image";
import { CheckPointType } from "@/lib/types";
import CheckPointFooter from "./CheckPointFooter";
import OwnCheckPoint from "./OwnCheckPoint";
import { useCheckPoint } from "../hooks/useCheckPoint";

// 文字列を指定の長さでカットして省略記号を追加する関数
const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + "...";
};

interface CheckPointProps {
  checkPoint: CheckPointType;
  setCheckPoints: React.Dispatch<React.SetStateAction<CheckPointType[]>>;
  isClosest?: boolean;
}

const CheckPoint = ({
  checkPoint,
  setCheckPoints,
  isClosest = false,
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

  return (
    <div
      className={`transition-all duration-500 ease-in-out transform ${isClosest
          ? "checkpoint-active-card-container w-full max-w-full"
          : "checkpoint-inactive-card-container"
        }`}
    >
      <div
        className={`transition-all duration-500 ease-in-out ${isClosest
            ? "checkpoint-active-card-body relative flex flex-col w-full p-4"
            : "checkpoint-inactive-card-body transition-all duration-500"
          }`}
      >
        {checkPoint.imageUrl && (
          <div
            className={`transition-all duration-500 ease-in-out ${isClosest
                ? "checkpoint-active-card-image-container w-full"
                : "checkpoint-inactive-card-image-container"
              }`}
            style={{
              position: "relative",
              ...(isClosest
                ? { height: "200px" }
                : { width: "64px", height: "64px" }),
              transition: "width 500ms ease-in-out, height 500ms ease-in-out",
            }}
          >
            <Image
              src={checkPoint.imageUrl}
              alt={checkPoint.point || "チェックポイント画像"}
              fill
              className={`transition-all duration-500 ease-in-out ${isClosest
                  ? "checkpoint-active-card-image object-cover"
                  : "checkpoint-inactive-card-image"
                }`}
              sizes={isClosest ? "100vw" : "64px"}
              priority={true}
            />
          </div>
        )}

        <div
          className={`transition-opacity duration-500 ease-in-out ${isClosest ? "opacity-100" : "opacity-0 absolute"
            }`}
          style={{
            display: isClosest ? "block" : "none",
            transitionDelay: isClosest ? "200ms" : "0ms",
          }}
        >
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

        <div
          className={`transition-opacity duration-500 ease-in-out ${!isClosest ? "opacity-100 flex" : "opacity-0 absolute"
            }`}
          style={{
            display: !isClosest ? "flex" : "none",
            transitionDelay: !isClosest ? "200ms" : "0ms",
          }}
        >
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

export default CheckPoint;
