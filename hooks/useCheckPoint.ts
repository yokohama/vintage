"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { CheckPointType, UserProfileType } from "@/lib/types";
import { useUserProfile } from "@/contexts/ProfileContext";

type UseCheckPointProps = {
  checkPoint: CheckPointType;
};

export const useCheckPoint = ({ checkPoint }: UseCheckPointProps) => {
  const { userProfile: currentUserProfile } = useUserProfile();
  const [profile, setProfile] = useState<UserProfileType | null>(
    checkPoint.profile,
  );
  const [isOwnCheckPoint, setIsOwnCheckPoint] = useState(false);

  /*
   * 画面サイズがsm以上ならtrueにする
   */
  const [isOverSm, setIsOverSm] = useState(false);

  // コンポーネントがマウントされた時に画面サイズをチェックし、
  // リサイズイベントでも更新する
  useEffect(() => {
    const checkScreenSize = () => {
      // Tailwindのsmブレークポイントは640px
      setIsOverSm(window.innerWidth >= 640);
    };

    // 初期チェック
    checkScreenSize();

    // リサイズイベントリスナーを追加
    window.addEventListener("resize", checkScreenSize);

    // クリーンアップ関数
    return () => {
      window.removeEventListener("resize", checkScreenSize);
    };
  }, []);

  useEffect(() => {
    if (!checkPoint) return;

    // プロフィール情報の設定
    if (checkPoint.profile) {
      setProfile(checkPoint.profile);
    }

    // 自分の投稿かどうかの判定
    if (currentUserProfile && profile && profile.id === currentUserProfile.id) {
      setIsOwnCheckPoint(true);
    } else {
      setIsOwnCheckPoint(false);
    }
  }, [checkPoint, currentUserProfile, profile]);

  // シェア処理
  const handleShare = async (e: React.MouseEvent) => {
    e.stopPropagation();

    if (!checkPoint) return;

    // シェアURLの作成（実際の実装に合わせて調整）
    const shareUrl = `${window.location.origin}/checkpoints/${checkPoint.id}`;

    if (navigator.share) {
      navigator
        .share({
          title: `${checkPoint.point} | Vintage`,
          text: checkPoint.description || "チェックポイントをシェアします",
          url: shareUrl,
        })
        .catch((error) => {
          console.error("シェアに失敗しました:", error);
        });
    } else {
      // クリップボードにコピー
      navigator.clipboard
        .writeText(shareUrl)
        .then(() => toast.success("URLをコピーしました"))
        .catch(() => toast.error("URLのコピーに失敗しました"));
    }
  };

  return {
    isOverSm,
    isOwnCheckPoint,
    handleShare,
  };
};
