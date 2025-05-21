import {
  BrandType,
  ProductType,
  VintageType,
  CheckPointType,
  ApiErrorType,
} from "@/lib/types";

import {
  SupabaseBrandType,
  SupabaseProductType,
  SupabaseVintageType,
  SupabaseCheckPointType,
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
  if (error) {
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
  profileId: cp.profile_id,
  vintage: {} as VintageType, // 循環参照を避けるため一時的に空オブジェクトを設定
  imageUrl: cp.image_url,
  point: cp.point,
  description: cp.description || "",
  createdAt: cp.created_at,
});
