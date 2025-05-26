"use client";

import { useState } from "react";
import Image from "next/image";
import { CheckPointType } from "@/lib/types";
import { CheckPointFooter } from "@/components/ui/CheckPoints";
import OwnCheckPoint from "./OwnCheckPoint";
import { useCheckPoint } from "@/hooks/useCheckPoint";
import ImageModal from "@/components/ui/ImageModal";

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
  const { isOwnCheckPoint, handleDelete } = useCheckPoint({ checkPoint });
  const [isModalOpen, setIsModalOpen] = useState(false);

  /*
   * ここで、画面サイズがsm以上なら、trueにしたい
   */
  const isOverSm = false;

  const containerClass = `${isOverSm
      ? "checkpoint-card-container"
      : isActive
        ? "checkpoint-active-card-container"
        : "checkpoint-inactive-card-container"
    } transition-all duration-500`;

  const bodyClass = `${isOverSm
      ? "checkpoint-card-body"
      : isActive
        ? "checkpoint-active-card-body"
        : "checkpoint-inactive-card-body"
    } transition-all duration-500`;

  const imageContainerClass = `${isOverSm
      ? "checkpoint-card-image-container"
      : isActive
        ? "checkpoint-active-card-image-container"
        : "checkpoint-inactive-card-image-container"
    }`;

  const imageClass = `${isOverSm
      ? "checkpoint-card-image"
      : isActive
        ? "checkpoint-active-card-image"
        : "checkpoint-inactive-card-image"
    }`;

  const descriptionClass = `${isOverSm
      ? "checkpoint-card-body-description"
      : isActive
        ? "checkpoint-active-card-description"
        : "checkpoint-inactive-card-description"
    } transition-all duration-500`;

  const handleImageClick = () => {
    if (isActive) {
      setIsModalOpen(true);
    }
  };

  return (
    <>
      <div
        className={`${containerClass} ${isActive ? "cursor-pointer" : ""}`}
        onClick={isActive ? handleImageClick : undefined}
      >
        <div className={isOverSm || isActive ? "" : "flex items-start"}>
          <div
            className={imageContainerClass}
            style={{
              position: "relative",
            }}
          >
            {(isOverSm || isActive) && (
              <h3 className="checkpoint-active-card-point">
                {checkPoint.point}
              </h3>
            )}
            <Image
              src={checkPoint.imageUrl}
              alt={checkPoint.point || "鑑定ポイント画像"}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
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
            {(isOverSm || isActive) && (
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

          {(isOverSm || isActive) && (
            <CheckPointFooter checkPoint={checkPoint} />
          )}
        </div>
      </div>

      {/* 画像モーダル */}
      <ImageModal
        imageUrl={checkPoint.imageUrl}
        alt={checkPoint.point || "鑑定ポイント画像"}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
};

export default CheckPoint;
