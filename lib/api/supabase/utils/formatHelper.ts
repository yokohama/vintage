import { supabase } from "@/lib/supabase";

import {
  BrandType,
  ProductType,
  VintageType,
  CheckPointType,
  ApiErrorType,
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

// 共通のエラーハンドリング関数
export const handleSupabaseError = (
  error: SupabaseErrorType,
  customMessage?: string,
): never => {
  const apiError: ApiErrorType = {
    message: customMessage || error.message,
    code: error.code,
  };
  throw apiError;
};

export const handleSupabaseUnknownError = ({
  msg,
  error,
}: {
  msg: string;
  error: Error | SupabaseErrorType | unknown;
}) => {
  console.error("Unlike check point error:", error);
  const apiError = {
    message: error instanceof Error ? msg : "未知のエラーが発生しました。",
    code:
      typeof error === "object" && error !== null && "code" in error
        ? (error.code as string)
        : "unknown",
  };
  throw apiError;
};

// データが存在しない場合のエラーハンドリング
export const handleNotFoundError = (entityName: string = "データ"): never => {
  const notFound: ApiErrorType = {
    message: `${entityName}が見つかりませんでした`,
    code: "NOT_FOUND",
  };
  throw notFound;
};

// Supabaseのレスポンスを処理する汎用関数
export const processSupabaseResponse = <T, R>(
  data: T | null,
  error: SupabaseErrorType | null,
  mapper: (item: T) => R,
  entityName: string = "データ",
): R => {
  if (error !== null) {
    handleSupabaseError(error);
  }

  if (!data) {
    handleNotFoundError(entityName);
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
    handleSupabaseError(error);
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
    console.error("mapVintage: vintage is undefined or null");
    return {
      id: 0,
      name: "",
      product: {} as ProductType,
      manufacturing_start_year: 0,
      manufacturing_end_year: 0,
      imageUrl: "",
      description: "",
      checkPoints: [],
    };
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
