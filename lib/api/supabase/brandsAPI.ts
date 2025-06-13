import { supabase } from "@/lib/supabase";
import { BrandType } from "@/lib/types";
import { SupabaseBrandType } from "./utils/types";
import { throwError } from "@/lib/error";
import {
  mapBrand,
  processSupabaseArrayResponse,
  processSupabaseResponse,
} from "./utils/formatHelper";

export class brandsAPI {
  static async getBrands(
    page: number = 1,
    limit: number = 10,
  ): Promise<BrandType[]> {
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    const { data, error } = await supabase
      .from("brands")
      .select("*, profile:profiles(*)")
      .is("deleted_at", null)
      .order("updated_at", { ascending: true })
      .range(from, to);

    return processSupabaseArrayResponse<SupabaseBrandType, BrandType>(
      data,
      error,
      mapBrand,
    );
  }

  static async addBrand(
    name: string,
    imageUrl: string,
    description: string | null,
    userId: string,
  ): Promise<BrandType> {
    try {
      const { data, error } = await supabase
        .from("brands")
        .insert({
          name: name,
          image_url: imageUrl,
          description: description || null,
          profile_id: userId,
        })
        .select("*, profile:profiles(*)")
        .single();

      return processSupabaseResponse<SupabaseBrandType, BrandType>(
        data,
        error,
        mapBrand,
        "ブランド",
      );
    } catch (error: unknown) {
      if (error) {
        throwError(error, "ブランドの追加で不明なエラーが発生しました");
      }
    }
    // 明示的にneverを返すことを示す
    throw new Error("This code will never be executed");
  }
}
