"use client";

import Image from "next/image";
import { CheckPointType } from "@/lib/types";
import { CheckPointFooter } from "@/components/ui/CheckPoints";
import OwnCheckPoint from "./OwnCheckPoint";
import { useCheckPoint } from "@/hooks/useCheckPoint";

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

  /*
   * ここで、画面サイズがsm以上なら、trueにしたい
   */
  const isOverSm = false;

  const containerClass = isOverSm
    ? "checkpoint-card-container"
    : isActive
      ? "checkpoint-active-card-container"
      : "checkpoint-inactive-card-container";

  const bodyClass = isOverSm
    ? "checkpoint-card-body"
    : isActive
      ? "checkpoint-active-card-body"
      : "checkpoint-inactive-card-body";

  const imageContainerClass = isOverSm
    ? "checkpoint-card-image-container"
    : isActive
      ? "checkpoint-active-card-image-container"
      : "checkpoint-inactive-card-image-container";

  const imageClass = isOverSm
    ? "checkpoint-card-image"
    : isActive
      ? "checkpoint-active-card-image"
      : "checkpoint-inactive-card-image";

  const descriptionClass = isOverSm
    ? "checkpoint-card-body-description"
    : isActive
      ? "checkpoint-active-card-description"
      : "checkpoint-inactive-card-description";

  return (
    <div className={containerClass}>
      <div className={isOverSm || isActive ? "" : "flex items-start"}>
        <div
          className={imageContainerClass}
          style={{
            position: "relative",
          }}
        >
          {(isOverSm || isActive) && (
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

        {(isOverSm || isActive) && <CheckPointFooter checkPoint={checkPoint} />}
      </div>
    </div>
  );
};

export default CheckPoint;
