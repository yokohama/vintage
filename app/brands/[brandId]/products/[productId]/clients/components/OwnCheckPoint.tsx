"use client";

import { CheckPointType } from "@/lib/types";
import { Trash2 } from "lucide-react";

interface OwnCheckPointProps {
  checkPoint: CheckPointType;
  setCheckPoints: React.Dispatch<React.SetStateAction<CheckPointType[]>>;
  isOwnCheckPoint: boolean;
  handleDelete: (
    checkPointId: number,
    e: React.MouseEvent,
    setCheckPoints: React.Dispatch<React.SetStateAction<CheckPointType[]>>,
  ) => void;
}

const OwnCheckPoint = ({
  checkPoint,
  setCheckPoints,
  isOwnCheckPoint,
  handleDelete,
}: OwnCheckPointProps) => {
  return (
    <>
      {isOwnCheckPoint && (
        <button
          onClick={(e) => handleDelete(checkPoint.id, e, setCheckPoints)}
          aria-label="削除"
        >
          <Trash2 size={18} />
        </button>
      )}
    </>
  );
};

export default OwnCheckPoint;
