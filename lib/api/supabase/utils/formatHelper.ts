import { supabase } from "@/lib/supabase";
import { throwError } from "@/lib/error";
import { notFound } from "next/navigation";

import {
  BrandType,
  ProductType,
  VintageType,
  CheckPointType,
  UserProfileType,
} from "@/lib/types";

import {
  SupabaseBrandType,
  SupabaseProductType,
  SupabaseVintageType,
  SupabaseCheckPointType,
  SupabaseProfileType,
  SupabaseCheckPointLikeType,
  SupabaseErrorType,
} from "./types";

// Supabaseのレスポンスを処理する汎用関数
export const processSupabaseResponse = <T, R>(
  data: T | null,
  error: SupabaseErrorType | null,
  mapper: (item: T) => R,
  entityName: string = "データ",
): R => {
  if (error) {
    throwError(error, `${entityName}の取得でエラーが発生しました`);
  }

  if (!data) {
    notFound();
  }

  return mapper(data as T);
};

// 配列レスポンスを処理する汎用関数
export const processSupabaseArrayResponse = <T, R>(
  data: T[] | null,
  error: SupabaseErrorType | null,
  mapper: (item: T) => R,
): R[] => {
  if (error) {
    if (error.code === "PGRST116") {
      // PGRST116はレコードが見つからない場合のエラーコード
      notFound();
    }
    throwError(error, "データの取得でエラーが発生しました");
  }

  return (data || []).map((item) => mapper(item));
};

export const mapProfile = (profile: SupabaseProfileType): UserProfileType => ({
  id: profile.id,
  displayName: profile.display_name,
  email: profile.email,
  avatarUrl: profile.avatar_url,
  websiteUrl: profile.website_url,
  twitterUrl: profile.twitter_url,
  instagramUrl: profile.instagram_url,
  facebookUrl: profile.facebook_url,
  linkedinUrl: profile.linkedin_url,
  youtubeUrl: profile.youtube_url,
  description: profile.description,
  checkPointLikes: profile.check_point_likes?.map(mapCheckPointLike) || [],
});

export const mapBrand = (brand: SupabaseBrandType): BrandType => ({
  id: brand.id,
  name: brand.name,
  imageUrl: brand.image_url,
  description: brand.description || "",
  profile: brand.profile ? mapProfile(brand.profile) : null,
  products: [], // 循環参照を避けるため空配列を設定
});

export const mapProduct = (product: SupabaseProductType): ProductType => ({
  id: product.id,
  brand: product.brand ? mapBrand(product.brand) : ({} as BrandType),
  name: product.name,
  imageUrl: product.image_url,
  description: product.description || "",
  vintages: [], // 循環参照を避けるため空配列を設定
});

export const mapVintage = (vintage: SupabaseVintageType): VintageType => {
  if (!vintage) {
    throwError(vintage, "vintageデータがぶっ壊れてるぜ！");
  }

  return {
    id: vintage.id,
    name: vintage.name || "",
    product: vintage.product
      ? mapProduct(vintage.product)
      : ({} as ProductType),
    manufacturing_start_year: vintage.manufacturing_start_year,
    manufacturing_end_year: vintage.manufacturing_end_year,
    imageUrl: vintage.image_url,
    description: vintage.description || "",
    checkPoints: vintage.checkpoints
      ? vintage.checkpoints.map((cp) =>
          mapCheckPoint({
            ...cp,
            vintage: undefined, // 循環参照を避けるためvintageを除外
          }),
        )
      : [],
  };
};

export const mapCheckPoint = (cp: SupabaseCheckPointType): CheckPointType => ({
  id: cp.id,
  profile: cp.profiles ? mapProfile(cp.profiles) : null,
  vintage: cp.vintage ? mapVintage(cp.vintage) : ({} as VintageType),
  imageUrl: cp.image_url,
  point: cp.point,
  description: cp.description || "",
  createdAt: cp.created_at,
  likeCount: cp.check_point_likes?.[0]?.count ?? 0,
  isLiked: cp.is_liked ?? false,
});

export const mapCheckPointLike = (
  cpLike: SupabaseCheckPointLikeType,
): CheckPointType => ({
  id: cpLike.check_points.id,
  profile: cpLike.check_points.profiles
    ? mapProfile(cpLike.check_points.profiles)
    : null,
  vintage: cpLike.check_points.vintage
    ? mapVintage(cpLike.check_points.vintage)
    : ({} as VintageType),
  imageUrl: cpLike.check_points.image_url,
  point: cpLike.check_points.point,
  description: cpLike.check_points.description || "",
  createdAt: cpLike.check_points.created_at,
  likeCount: cpLike.check_points.check_point_likes?.[0]?.count ?? 0,
  isLiked: true, // いいねしたチェックポイントなので常にtrue
});

export const mapIsLiked = async (
  checkPoints: CheckPointType[],
  userId: string,
): Promise<CheckPointType[]> => {
  if (!userId || checkPoints.length === 0) {
    return checkPoints.map((cp) => ({
      ...cp,
      isLiked: false,
    }));
  }

  const checkPointIds = checkPoints.map((cp) => cp.id);

  const { data: likesData } = await supabase
    .from("check_point_likes")
    .select("check_point_id")
    .eq("profile_id", userId)
    .in("check_point_id", checkPointIds);

  const likedCheckPointIds = new Set(
    likesData?.map((like) => like.check_point_id) || [],
  );

  // いいね状態をセット
  return checkPoints.map((cp) => ({
    ...cp,
    isLiked: likedCheckPointIds.has(cp.id),
  }));
};
