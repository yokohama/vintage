import { supabase } from "@/lib/supabase";
import { BrandType } from "@/lib/types";
import { SupabaseBrandType } from "./utils/types";
import { mapBrand, processSupabaseArrayResponse } from "./utils/formatHelper";

export class brandsAPI {
  static async getBrands(): Promise<BrandType[]> {
    const { data, error } = await supabase
      .from("brands")
      .select("*")
      .is("deleted_at", null)
      .order("updated_at", { ascending: true });

    // 共通の配列レスポンス処理関数を使用
    return processSupabaseArrayResponse<SupabaseBrandType, BrandType>(
      data,
      error,
      mapBrand,
    );
  }
}
