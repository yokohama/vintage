import Link from "next/link";
import Image from "next/image";
import { Heart, Share2 } from "lucide-react";
import { siteConfig } from "@/lib/config/siteConfig";
import { CheckPointType } from "@/lib/types";
import { useCheckPoint } from "@/hooks/useCheckPoint";

type CheckPointsProps = {
  checkPoints: CheckPointType[];
};

type CheckPointProps = {
  checkPoint: CheckPointType;
};

interface CheckPointFooterProps {
  checkPoint: CheckPointType;
  isLikeLoading: boolean;
  handleShare: (e: React.MouseEvent) => void;
  handleLike: (e: React.MouseEvent) => void;
}

export const CheckPoints = ({ checkPoints }: CheckPointsProps) => {
  return (
    <div className="checkpoint-cards-container">
      {checkPoints.map((cp, index) => {
        return (
          <div key={index}>
            <CheckPoint checkPoint={cp} />
          </div>
        );
      })}
    </div>
  );
};

export const CheckPoint = ({ checkPoint }: CheckPointProps) => {
  const { isLikeLoading, handleShare, handleLike } = useCheckPoint({
    checkPoint,
  });

  return (
    <div className="checkpoint-card-container">
      <div className="checkpoint-card-image-container">
        {checkPoint.point && (
          <div className="absolute top-2 right-2 z-10 bg-amber-800 text-white py-1 px-2 rounded-md text-sm font-bold shadow-sm">
            {checkPoint.point}
          </div>
        )}
        <Image
          src={checkPoint.imageUrl}
          alt={checkPoint.point || "チェックポイント画像"}
          fill
          className="checkpoint-card-image"
          priority={true}
        />
      </div>
      <div className="checkpoint-card-body-container">
        <p className="checkpoint-card-body-description">
          {checkPoint.description}
        </p>
      </div>
      <CheckPointFooter
        checkPoint={checkPoint}
        isLikeLoading={isLikeLoading}
        handleLike={handleLike}
        handleShare={handleShare}
      />
    </div>
  );
};

export const CheckPointFooter = ({
  checkPoint,
  isLikeLoading,
  handleLike,
  handleShare,
}: CheckPointFooterProps) => {
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
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleLike(e);
          }}
          className={`checkpoint-active-card-footer-sns-button ${checkPoint.isLiked ? "text-amber-700" : ""
            } ${isLikeLoading ? "opacity-50 cursor-wait" : ""}`}
          aria-label="いいね"
          disabled={isLikeLoading}
        >
          <Heart
            className={
              checkPoint.isLiked
                ? "checkpoint-active-card-footer-sns-liked-heart"
                : ""
            }
          />
          <span className="ml-1">{checkPoint.likeCount}</span>
        </button>
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
