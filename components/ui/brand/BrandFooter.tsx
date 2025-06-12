"use client";

import Image from "next/image";
import Link from "next/link";

import { siteConfig } from "@/lib/config/siteConfig";
import { BrandType } from "@/lib/types";

interface CheckPointFooterProps {
  brand: BrandType;
  onLikeSuccess?: () => void;
}

const BrandFooter = ({ brand }: CheckPointFooterProps) => {
  return (
    <div className="item-card-footer-container mt-auto">
      <Link
        href={`/profiles/${brand.profile?.id}`}
        onClick={(e) => e.stopPropagation()} // 親要素のクリックイベントを停止
        className="item-card-footer-profile-container"
      >
        <Image
          src={
            brand.profile?.avatarUrl || siteConfig.images.defaultProfileAvatar
          }
          alt={brand.profile?.displayName || "ユーザー"}
          width={32}
          height={32}
          unoptimized={
            brand.profile?.avatarUrl?.includes("api.dicebear.com") || false
          }
          className="item-card-footer-profile-image"
        />
        <span className="item-card-footer-profile-name">
          {brand.profile?.displayName}
        </span>
      </Link>
    </div>
  );
};

export default BrandFooter;
