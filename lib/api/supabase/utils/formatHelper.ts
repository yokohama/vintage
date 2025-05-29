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
  products: [], // 循環参照を避けるため空配列を設定
});

export const mapProduct = (product: SupabaseProductType): ProductType => ({
  id: product.id,
  brand: mapBrand(product.brands),
  name: product.name,
  imageUrl: product.image_url,
  description: product.description || "",
  vintages: product.vintages?.map(mapVintage) || [],
});

export const mapVintage = (vintage: SupabaseVintageType): VintageType => ({
  id: vintage.id,
  name: vintage.name || "",
  product: {} as ProductType, // 循環参照を避けるため一時的に空オブジェクトを設定
  manufacturing_start_year: vintage.manufacturing_start_year,
  manufacturing_end_year: vintage.manufacturing_end_year,
  imageUrl: vintage.image_url,
  description: vintage.description || "",
  checkPoints: vintage.checkpoints?.map(mapCheckPoint) || [],
});

export const mapCheckPoint = (cp: SupabaseCheckPointType): CheckPointType => ({
  id: cp.id,
  profile: cp.profiles ? mapProfile(cp.profiles) : null,
  vintage: {} as VintageType, // 循環参照を避けるため一時的に空オブジェクトを設定
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
  vintage: {} as VintageType, // 循環参照を避けるため一時的に空オブジェクトを設定
  imageUrl: cpLike.check_points.image_url,
  point: cpLike.check_points.point,
  description: cpLike.check_points.description || "",
  createdAt: cpLike.check_points.created_at,
  likeCount: cpLike.check_points.check_point_likes?.[0]?.count ?? 0,
  isLiked: true, // いいねしたチェックポイントなので常にtrue
});

export const setIsLiked = async (
  checkPoints: CheckPointType[],
  userId?: string,
): Promise<CheckPointType[]> => {
  try {
    let user = null;

    // ユーザーIDが渡された場合はそれを使用し、そうでない場合はgetUser()を試みる
    if (userId) {
      user = { id: userId };
    } else {
      try {
        const { data } = await supabase.auth.getUser();
        user = data.user;
      } catch (error) {
        console.error("認証情報の取得に失敗しました:", error);
        // 認証エラーの場合は、いいねなしで返す
        return checkPoints;
      }
    }

    if (user) {
      // ユーザーがいいねしたチェックポイントのIDを取得
      const { data: likedData } = await supabase
        .from("check_point_likes")
        .select("check_point_id")
        .eq("profile_id", user.id)
        .is("deleted_at", null);

      if (likedData) {
        // いいねしたチェックポイントのIDのセットを作成
        const likedIds = new Set(likedData.map((item) => item.check_point_id));

        // チェックポイントにいいね状態を設定
        return checkPoints.map((cp) => ({
          ...cp,
          isLiked: likedIds.has(cp.id),
        }));
      }
    }
  } catch (error) {
    console.error("いいね状態の設定に失敗しました:", error);
  }

  return checkPoints;
};
