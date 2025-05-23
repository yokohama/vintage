import Link from "next/link";
import Image from "next/image";
import { Trash2, Share2, Heart } from "lucide-react";
import { siteConfig } from "@/lib/config/siteConfig";
import { CheckPointType } from "@/lib/types";

type CheckPointProps = {
  checkPoint: CheckPointType;
  isOwnCheckPoint: boolean;
  handleLike: (e: React.MouseEvent) => void;
  handleShare: (e: React.MouseEvent) => void;
  handleDelete: (
    id: number | string,
    e: React.MouseEvent,
    setCheckPoints?: React.Dispatch<React.SetStateAction<CheckPointType[]>>,
  ) => void;
  isClosest: boolean;
  liked: boolean;
  likeCount: number;
  isLikeLoading: boolean;
  setCheckPoints?: React.Dispatch<React.SetStateAction<CheckPointType[]>>;
};

const CheckPoint = ({
  isOwnCheckPoint,
  checkPoint,
  handleLike,
  handleShare,
  handleDelete,
  isClosest,
  liked,
  likeCount,
  isLikeLoading,
  setCheckPoints,
}: CheckPointProps) => {
  return (
    <div
      className={`p-4 transition-colors duration-300 ${isClosest
          ? "bg-amber-500 border-2 border-black"
          : "bg-white border-transparent"
        }`}
    >
      <p
        className={`${isClosest ? "font-bold" : "font-normal"}`}
      >{`id: ${checkPoint.id}: ${isClosest} `}</p>
      {isOwnCheckPoint && (
        <button
          onClick={(e) => handleDelete(checkPoint.id, e, setCheckPoints)}
          aria-label="削除"
        >
          <Trash2 size={18} />
        </button>
      )}
      <div>
        {checkPoint.imageUrl && (
          <div className="relative h-16 w-16 mr-3 flex-shrink-0 rounded-sm overflow-hidden">
            <Image
              src={checkPoint.imageUrl}
              alt={checkPoint.point || "チェックポイント画像"}
              fill
              sizes="(max-width: 768px) 100vw, 64px"
              className="object-cover sepia-[0.15] brightness-[0.98]"
              priority={true}
            />
          </div>
        )}
        <div>
          <h4>{checkPoint.point}</h4>
          <p>{`id: ${checkPoint.id}: ${isClosest} `}</p>
          <p>{checkPoint.description}</p>
        </div>
      </div>

      {/* フッター部分（SNS領域） */}
      <div>
        <div>
          {/* 投稿者情報 - クリックでプロフィールページへ */}
          <Link
            href={`/profile/${checkPoint.profile?.id}`}
            onClick={(e) => e.stopPropagation()} // 親要素のクリックイベントを停止
          >
            <div className="flex-shrink-0 w-6 h-6 rounded-full overflow-hidden">
              <Image
                src={
                  checkPoint.profile?.avatarUrl ||
                  siteConfig.images.defaultProfileAvatar
                }
                alt={checkPoint.profile?.displayName || "ユーザー"}
                width={24}
                height={24}
                className="object-cover w-full h-full"
                unoptimized={
                  checkPoint.profile?.avatarUrl?.includes("api.dicebear.com") ||
                  false
                }
              />
            </div>
            <span className="">{checkPoint.profile?.displayName}</span>
          </Link>

          {/* インタラクションボタン */}
          <div className="">
            <button
              onClick={(e) => {
                e.stopPropagation(); // 親要素のクリックイベントを停止
                handleLike(e);
              }}
              className={`flex items-center text-xs ${liked ? "" : ""} hover:oldies-text-accent transition-colors ${isLikeLoading ? "opacity-50 cursor-wait" : ""}`}
              aria-label="いいね"
              disabled={isLikeLoading}
            >
              <Heart size={14} className={liked ? "" : ""} />
              <span className="ml-1">{likeCount}</span>
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation(); // 親要素のクリックイベントを停止
                handleShare(e);
              }}
              className=""
              aria-label="シェア"
            >
              <Share2 size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckPoint;
