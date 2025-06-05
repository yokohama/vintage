import { supabase } from "@/lib/supabase";
import { VintageType } from "@/lib/types";
import { SupabaseVintageType } from "./utils/types";

import { mapVintage, processSupabaseResponse } from "./utils/formatHelper";

export class vintageAPI {
  static async getVintage(vintageId: number): Promise<VintageType> {
    const { data, error } = await supabase
      .from("vintages")
      .select(
        `
        *, 
        checkpoints:check_points (
          id,
          point,
          image_url,
          description,
          profile_id,
          created_at
        )
      `,
      )
      .eq("id", vintageId)
      .is("deleted_at", null)
      .single();

    const formattedData: VintageType = processSupabaseResponse(
      data,
      error,
      (item) => mapVintage(item as SupabaseVintageType),
      "ビンテージ",
    );

    return formattedData;
  }
}
