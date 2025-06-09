import { supabase } from "@/lib/supabase";
import { ProductType } from "@/lib/types";
import { SupabaseProductType } from "./utils/types";

import {
  mapProduct,
  mapVintage,
  processSupabaseResponse,
  processSupabaseArrayResponse,
} from "./utils/formatHelper";

export class productsAPI {
  static async getSimpleProduct(productId: number): Promise<ProductType> {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("id", productId)
      .is("deleted_at", null)
      .order("updated_at", { ascending: false })
      .single();

    const formattedData: ProductType = processSupabaseResponse(
      data,
      error,
      (item) => {
        const product = mapProduct(item as SupabaseProductType);
        return product;
      },
      "製品",
    );

    return formattedData;
  }

  static async getProduct(
    productId: number,
    userId?: string,
  ): Promise<ProductType> {
    // 製品情報、ブランド情報、ヴィンテージ情報、チェックポイント情報を一度に取得
    const { data, error } = await supabase
      .from("products")
      .select(
        `
        *,
        brand:brand_id (
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
            created_at,
            profiles (*),
            check_point_likes (count)
          )
        )
      `,
      )
      .eq("id", productId)
      .is("deleted_at", null)
      .order("updated_at", { ascending: false })
      .single();

    const formattedData: ProductType = processSupabaseResponse(
      data,
      error,
      (item) => {
        // まずProductをマッピング
        const product = mapProduct(item as SupabaseProductType);

        // vintagesが存在する場合、それらをマッピングして製品に追加
        if (item.vintages && Array.isArray(item.vintages)) {
          product.vintages = item.vintages.map((vintage) => {
            const mappedVintage = mapVintage(vintage);
            return mappedVintage;
          });
        }

        return product;
      },
      "製品",
    );

    // vintagesを製造開始年の昇順（古い順）でソート
    if (formattedData.vintages && formattedData.vintages.length > 0) {
      formattedData.vintages.sort(
        (a, b) => a.manufacturing_start_year - b.manufacturing_start_year,
      );
    }

    return formattedData;
  }

  static async getProductsByBrandId(brandId: number): Promise<ProductType[]> {
    const { data, error } = await supabase
      .from("products")
      .select(
        `
        *,
        brand:brand_id (
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

    const formattedData: ProductType[] = processSupabaseArrayResponse(
      data,
      error,
      (item: SupabaseProductType) => mapProduct(item),
    );
    return formattedData;
  }
}
