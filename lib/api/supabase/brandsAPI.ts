import { supabase } from "@/lib/supabase";
import { BrandType, ApiErrorType } from "@/lib/types";

// Supabaseから返されるデータの型定義
interface SupabaseBrandType {
  id: number;
  name: string;
  image_url: string;
  description: string | null;
  deleted_at?: string | null;
  updated_at?: string;
}

export class brandsAPI {
  static async getBrands(): Promise<BrandType[]> {
    const { data, error } = await supabase
      .from("brands")
      .select("*")
      .is("deleted_at", null)
      .order("updated_at", { ascending: true });

    if (error) {
      const apiError: ApiErrorType = {
        message: error.message,
        code: error.code,
      };
      throw apiError;
    }

    const formattedData: BrandType[] = (data || []).map(
      (item: SupabaseBrandType) => {
        return {
          id: item.id,
          name: item.name,
          imageUrl: item.image_url,
          description: item.description || "",
          products: [], // 必要に応じて別のクエリで取得するか、空配列を設定
        };
      },
    );

    return formattedData;
  }
}
