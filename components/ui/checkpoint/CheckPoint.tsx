"use client";

import Image from "next/image";
import { CheckPointType } from "@/lib/types";
import { useCheckPoint } from "@/hooks/useCheckPoint";
import { useModal } from "@/hooks/useModal";
import ImageModal from "@/components/ui/ImageModal";
import CheckPointFooter from "@/components/ui/checkpoint/CheckPointFooter";
import DeleteButton from "@/components/ui/delete/DeleteButton";

interface CheckPointProps {
  checkPoint: CheckPointType;
  isActive?: boolean;
  onLikeSuccess?: () => void;
  onDeleteSuccess?: () => void;
}

const CheckPoint = ({
  checkPoint,
  isActive,
  onLikeSuccess,
  onDeleteSuccess,
}: CheckPointProps) => {
  const { isOverSm, isOwnCheckPoint } = useCheckPoint({
    checkPoint,
  });

  const { isModalOpen, handleOpenModal, handleCloseModal } = useModal();

  const containerClass = `${
    isOverSm
      ? ""
      : isActive
        ? "checkpoint-active-card-container"
        : "checkpoint-inactive-card-container"
  } transition-all duration-500`;

  const bodyClass = `${
    isOverSm
      ? "checkpoint-card-body"
      : isActive
        ? "checkpoint-active-card-body"
        : "checkpoint-inactive-card-body"
  } transition-all duration-300`;

  const imageContainerClass = `${
    isOverSm
      ? "checkpoint-card-image-container"
      : isActive
        ? "checkpoint-active-card-image-container"
        : "checkpoint-inactive-card-image-container"
  }`;

  const imageClass = `${
    isOverSm
      ? "checkpoint-card-image"
      : isActive
        ? "checkpoint-active-card-image"
        : "checkpoint-inactive-card-image"
  }`;

  const descriptionClass = `${
    isOverSm
      ? "checkpoint-card-body-description"
      : isActive
        ? "checkpoint-active-card-description"
        : "checkpoint-inactive-card-description"
  } transition-all duration-100`;

  // カード全体のクリックハンドラ
  const handleCardClick = () => {
    if (isActive) {
      handleOpenModal();
    }
  };

  return (
    <>
      <div
        className={`${containerClass} ${isActive ? "cursor-pointer" : ""} h-full flex flex-col`}
        onClick={isActive ? handleCardClick : undefined}
      >
        <div
          className={`${isOverSm || isActive ? "flex flex-col h-full" : "flex items-start"}`}
        >
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
            {(isOverSm || isActive) && isOwnCheckPoint && (
              <div className="flex justify-end w-full">
                <DeleteButton
                  checkPointId={checkPoint.id}
                  onSuccess={onDeleteSuccess}
                />
              </div>
            )}
          </div>

          {(isOverSm || isActive) && (
            <CheckPointFooter
              checkPoint={checkPoint}
              onLikeSuccess={onLikeSuccess}
            />
          )}
        </div>
      </div>

      {/* 画像モーダル */}
      <ImageModal
        imageUrl={checkPoint.imageUrl}
        alt={checkPoint.point || "鑑定ポイント画像"}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </>
  );
};

export default CheckPoint;
