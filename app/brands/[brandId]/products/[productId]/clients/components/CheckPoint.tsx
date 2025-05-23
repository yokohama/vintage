"use client";

import { CheckPointType } from "@/lib/types";
import ActiveCheckPoint from "./ActiveCheckPoint";
import InactiveCheckPoint from "./InactiveCheckPoint";
import { useCheckPoint } from "../hooks/useCheckPoint";

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
  return isClosest ? (
    <ActiveCheckPoint
      checkPoint={checkPoint}
      setCheckPoints={setCheckPoints}
      isOwnCheckPoint={isOwnCheckPoint}
      liked={liked}
      likeCount={likeCount}
      isLikeLoading={isLikeLoading}
      handleShare={handleShare}
      handleLike={handleLike}
      handleDelete={handleDelete}
    />
  ) : (
    <InactiveCheckPoint
      checkPoint={checkPoint}
      setCheckPoints={setCheckPoints}
      isOwnCheckPoint={isOwnCheckPoint}
      liked={liked}
      likeCount={likeCount}
      isLikeLoading={isLikeLoading}
      handleShare={handleShare}
      handleLike={handleLike}
      handleDelete={handleDelete}
    />
  );
};

export default CheckPoint;
