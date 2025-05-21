import { supabase } from "@/lib/supabase";
import {
  BrandType,
  ProductType,
  VintageType,
  CheckPointType,
  ApiErrorType,
} from "@/lib/types";

// Supabaseから返されるデータの型定義
interface SupabaseBrandType {
  id: number;
  name: string;
  image_url: string;
  description: string | null;
}

interface SupabaseProductType {
  id: number;
  brand_id?: number;
  brands: SupabaseBrandType;
  name: string;
  image_url: string;
  description: string | null;
  vintages: SupabaseVintageType[];
}

interface SupabaseVintageType {
  id: number;
  name: string | null;
  manufacturing_start_year: number;
  manufacturing_end_year: number;
  image_url: string;
  description: string | null;
  checkpoints: SupabaseCheckPointType[];
}

interface SupabaseCheckPointType {
  id: number;
  profile_id: string | null;
  image_url: string;
  point: string;
  description: string | null;
  created_at?: string | null;
}

const mapBrand = (brand: SupabaseBrandType): BrandType => ({
  id: brand.id,
  name: brand.name,
  imageUrl: brand.image_url,
  description: brand.description || "",
  products: [], // 循環参照を避けるため空配列を設定
});

const mapProduct = (product: SupabaseProductType): ProductType => ({
  id: product.id,
  brand: mapBrand(product.brands),
  name: product.name,
  imageUrl: product.image_url,
  description: product.description || "",
  vintages: product.vintages?.map(mapVintage) || [],
});

const mapVintage = (vintage: SupabaseVintageType): VintageType => ({
  id: vintage.id,
  name: vintage.name || "",
  product: {} as ProductType, // 循環参照を避けるため一時的に空オブジェクトを設定
  manufacturing_start_year: vintage.manufacturing_start_year,
  manufacturing_end_year: vintage.manufacturing_end_year,
  imageUrl: vintage.image_url,
  description: vintage.description || "",
  checkPoints: vintage.checkpoints?.map(mapCheckPoint) || [],
});

const mapCheckPoint = (cp: SupabaseCheckPointType): CheckPointType => ({
  id: cp.id,
  profileId: cp.profile_id,
  vintage: {} as VintageType, // 循環参照を避けるため一時的に空オブジェクトを設定
  imageUrl: cp.image_url,
  point: cp.point,
  description: cp.description || "",
  createdAt: cp.created_at,
});

export class productsAPI {
  static async getProduct(productId: number): Promise<ProductType> {
    // 製品情報、ブランド情報、ヴィンテージ情報、チェックポイント情報を一度に取得
    const { data, error } = await supabase
      .from("products")
      .select(
        `
        *,
        brands:brand_id (
          id,
          name,
          image_url,
          description
        ),
        vintages:vintages (
          id,
          name,
          manufacturing_start_year,
          manufacturing_end_year,
          image_url,
          description,
          checkpoints:check_points (
            id,
            point,
            image_url,
            description,
            profile_id,
            created_at
          )
        )
      `,
      )
      .eq("id", productId)
      .is("deleted_at", null)
      .order("updated_at", { ascending: false })
      .single();

    if (error) {
      const apiError: ApiErrorType = {
        message: error.message,
        code: error.code,
      };
      throw apiError;
    }

    if (!data) {
      const notFound: ApiErrorType = {
        message: "製品が見つかりませんでした",
        code: "NOT_FOUND",
      };
      throw notFound;
    }

    // vintagesを製造開始年の昇順（古い順）でソート
    const sortedVintages = [...data.vintages].sort(
      (a, b) => a.manufacturing_start_year - b.manufacturing_start_year,
    );

    const supa2localData: SupabaseProductType = {
      id: data.id,
      brand_id: data.brand_id,
      name: data.name,
      image_url: data.image_url,
      description: data.description,
      brands: data.brands,
      vintages: sortedVintages.map((vintage: SupabaseVintageType) => ({
        id: vintage.id,
        name: vintage.name || "",
        manufacturing_start_year: vintage.manufacturing_start_year,
        manufacturing_end_year: vintage.manufacturing_end_year,
        image_url: vintage.image_url,
        description: vintage.description,
        checkpoints: vintage.checkpoints || [],
      })),
    };

    return mapProduct(supa2localData);
  }

  static async getProductsByBrandId(brandId: number): Promise<ProductType[]> {
    const { data, error } = await supabase
      .from("products")
      .select(
        `
        *,
        brands:brand_id (
          id,
          name,
          image_url,
          description
        )
      `,
      )
      .eq("brand_id", brandId)
      .is("deleted_at", null)
      .order("updated_at", { ascending: true });

    if (error) {
      const apiError: ApiErrorType = {
        message: error.message,
        code: error.code,
      };
      throw apiError;
    }

    const supa2localData: ProductType[] = (data || []).map(
      (item: {
        id: number;
        brand_id: number;
        name: string;
        image_url: string;
        description: string | null;
        brands: SupabaseBrandType;
      }) => {
        // 型安全なオブジェクト作成
        const productData: SupabaseProductType = {
          id: item.id,
          brand_id: item.brand_id,
          brands: {
            id: item.brands.id,
            name: item.brands.name,
            image_url: item.brands.image_url,
            description: item.brands.description,
          },
          name: item.name,
          image_url: item.image_url,
          description: item.description,
          vintages: [], // このクエリではvintagesを取得していないため空配列を設定
        };

        return mapProduct(productData);
      },
    );

    return supa2localData;
  }
}
