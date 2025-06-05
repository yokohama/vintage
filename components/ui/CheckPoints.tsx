import Link from "next/link";
import Image from "next/image";
import { Share2 } from "lucide-react";
import { siteConfig } from "@/lib/config/siteConfig";
import { CheckPointType } from "@/lib/types";
import { useCheckPoint } from "@/hooks/useCheckPoint";

import { LikeButton } from "@/components/ui/like/LikeButton";

type CheckPointsProps = {
  checkPoints: CheckPointType[];
  onLikeChange?: (
    checkPointId: number,
    isLiked: boolean,
    likeCount: number,
  ) => void;
};

type CheckPointProps = {
  checkPoint: CheckPointType;
  onLikeChange?: (
    checkPointId: number,
    isLiked: boolean,
    likeCount: number,
  ) => void;
};

interface CheckPointFooterProps {
  checkPoint: CheckPointType;
  setCheckPoints?: React.Dispatch<React.SetStateAction<CheckPointType[]>>;
  onLikeChange?: (
    checkPointId: number,
    isLiked: boolean,
    likeCount: number,
  ) => void;
}

export const CheckPoints = ({
  checkPoints,
  onLikeChange,
}: CheckPointsProps) => {
  return (
    <div className="checkpoint-cards-container">
      {checkPoints.map((cp, index) => {
        return (
          <div key={index}>
            <CheckPoint checkPoint={cp} onLikeChange={onLikeChange} />
          </div>
        );
      })}
    </div>
  );
};

export const CheckPoint = ({ checkPoint, onLikeChange }: CheckPointProps) => {
  return (
    <div className="checkpoint-card-container">
      <div className="checkpoint-card-image-container">
        {checkPoint.point && (
          <div className="checkpoint-active-card-point">{checkPoint.point}</div>
        )}
        <Image
          src={checkPoint.imageUrl}
          alt={checkPoint.point || "チェックポイント画像"}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
          className="checkpoint-card-image"
          priority={true}
        />
      </div>
      <div className="checkpoint-card-body-container">
        <p className="checkpoint-card-body-description">
          {checkPoint.description}
        </p>
      </div>
      <CheckPointFooter checkPoint={checkPoint} onLikeChange={onLikeChange} />
    </div>
  );
};
export const CheckPointFooter = ({
  checkPoint,
  setCheckPoints,
  onLikeChange,
}: CheckPointFooterProps) => {
  const { handleShare, isLiked, likeCount, setIsLiked } = useCheckPoint({
    checkPoint,
    setCheckPoints,
  });

  return (
    <div className="checkpoint-active-card-footer-container">
      <Link
        href={`/profiles/${checkPoint.profile?.id}`}
        onClick={(e) => e.stopPropagation()} // 親要素のクリックイベントを停止
        className="checkpoint-active-card-footer-profile-container"
      >
        <Image
          src={
            checkPoint.profile?.avatarUrl ||
            siteConfig.images.defaultProfileAvatar
          }
          alt={checkPoint.profile?.displayName || "ユーザー"}
          width={32}
          height={32}
          unoptimized={
            checkPoint.profile?.avatarUrl?.includes("api.dicebear.com") || false
          }
          className="checkpoint-active-card-footer-profile-image"
        />
        <span className="checkpoint-active-card-footer-profile-name">
          {checkPoint.profile?.displayName}
        </span>
      </Link>

      {/* SNS */}
      <div className="checkpoint-active-card-footer-sns-container">
        {/* LikeButtonコンポーネントを使用 */}
        <LikeButton
          checkPointId={checkPoint.id}
          isLiked={isLiked || false}
          likeCount={likeCount}
          onLikeChange={(newIsLiked, newLikeCount) => {
            // useCheckPointフックの状態を更新
            setIsLiked(newIsLiked);

            // 親コンポーネントの状態も更新
            if (setCheckPoints) {
              setCheckPoints((prev) =>
                prev.map((cp) =>
                  cp.id === checkPoint.id
                    ? {
                        ...cp,
                        isLiked: newIsLiked,
                        likeCount: newLikeCount,
                      }
                    : cp,
                ),
              );
            }

            // 外部から渡されたonLikeChangeコールバックも呼び出す
            if (onLikeChange) {
              onLikeChange(checkPoint.id, newIsLiked, newLikeCount);
            }
          }}
        />
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleShare(e);
          }}
          className="checkpoint-active-card-footer-sns-button"
          aria-label="シェア"
        >
          <Share2 />
        </button>
      </div>
    </div>
  );
};

export default CheckPoints;
