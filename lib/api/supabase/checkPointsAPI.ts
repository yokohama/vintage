import { supabase } from "@/lib/supabase";
import { CheckPointType } from "@/lib/types";
import {
  mapCheckPoint,
  processSupabaseArrayResponse,
  handleSupabaseError,
  processSupabaseResponse,
} from "./utils/formatHelper";
import { SupabaseCheckPointType } from "./utils/types";

export class checkPointsAPI {
  static async getCheckPoints(): Promise<CheckPointType[]> {
    const { data, error } = await supabase
      .from("check_points")
      .select("*, vintages(*, products(*)), profiles(*)")
      .is("deleted_at", null)
      .order("updated_at", { ascending: false });

    return processSupabaseArrayResponse<SupabaseCheckPointType, CheckPointType>(
      data,
      error,
      mapCheckPoint,
    );
  }

  static async getCheckPointsByVintageId(
    vintageId: number,
  ): Promise<CheckPointType[]> {
    const { data, error } = await supabase
      .from("check_points")
      .select("*, vintages(*, products(*)), profiles(*)")
      .eq("vintage_id", vintageId)
      .is("deleted_at", null)
      .order("updated_at", { ascending: false });

    return processSupabaseArrayResponse<SupabaseCheckPointType, CheckPointType>(
      data,
      error,
      mapCheckPoint,
    );
  }

  static async addCheckPoint(
    vintageId: number,
    point: string,
    imageUrl: string,
    description: string | null,
    userId: string,
  ): Promise<CheckPointType> {
    try {
      const { data, error } = await supabase
        .from("check_points")
        .insert({
          vintage_id: vintageId,
          point: point,
          image_url: imageUrl,
          description: description || null,
          profile_id: userId, // user_idではなくprofile_idを使用
        })
        .select("*, vintages(*, products(*, brands(*))), profiles(*)")
        .single();

      if (error !== null) {
        console.error("Supabase error:", error);
        handleSupabaseError(error, "チェックポイントの追加に失敗しました");
      }

      return processSupabaseResponse<SupabaseCheckPointType, CheckPointType>(
        data,
        null,
        mapCheckPoint,
        "チェックポイント",
      );
    } catch (error: unknown) {
      console.error("Supabase error:", error);
      // 未知のエラーの場合
      const apiError = {
        message:
          error instanceof Error
            ? error.message
            : "チェックポイントの追加に失敗しました",
        code:
          typeof error === "object" && error !== null && "code" in error
            ? (error.code as string)
            : "unknown",
      };
      throw apiError;
    }
  }

  static async uploadImage(
    file: File,
    userId: string,
    folder: string = "check_points",
  ): Promise<string> {
    // ファイル名の一意性を確保するためにタイムスタンプとランダム文字列を追加
    const fileExt = file.name.split(".").pop();
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 15);
    const fileName = `${userId}_${timestamp}_${randomString}.${fileExt}`;
    const filePath = `${folder}/${fileName}`;

    // Supabaseにアップロード
    const { error } = await supabase.storage
      .from("images")
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (error !== null) {
      console.error("Storage upload error:", error);
      handleSupabaseError(error, `画像のアップロードに失敗しました`);
    }

    // 公開URLを取得
    const {
      data: { publicUrl },
    } = supabase.storage.from("images").getPublicUrl(filePath);
    return publicUrl;
  }

  // チェックポイントを削除する
  static async deleteCheckPoint(checkPointId: number): Promise<void> {
    try {
      const { error } = await supabase
        .from("check_points")
        .update({ deleted_at: new Date().toISOString() })
        .eq("id", checkPointId);

      if (error !== null) {
        console.error("Delete check point error:", error);
        handleSupabaseError(error, "チェックポイントの削除に失敗しました");
      }
    } catch (error: unknown) {
      console.error("Delete check point error:", error);
      // 未知のエラーの場合
      const apiError = {
        message:
          error instanceof Error
            ? error.message
            : "チェックポイントの削除に失敗しました",
        code:
          typeof error === "object" && error !== null && "code" in error
            ? (error.code as string)
            : "unknown",
      };
      throw apiError;
    }
  }

  // チェックポイントにいいねする
  static async likeCheckPoint(
    checkPointId: number,
    profileId: string,
  ): Promise<void> {
    try {
      // いいねを追加（重複を防ぐためにupsertを使用）
      const { error } = await supabase.from("check_point_likes").upsert(
        {
          check_point_id: checkPointId,
          profile_id: profileId,
          created_at: new Date().toISOString(),
        },
        {
          onConflict: "check_point_id,profile_id",
          ignoreDuplicates: true,
        },
      );

      if (error) {
        console.error("Like check point error:", error);
        handleSupabaseError(error, "いいねの追加に失敗しました");
      }
    } catch (error: unknown) {
      console.error("Like check point error:", error);
      // 未知のエラーの場合
      const apiError = {
        message:
          error instanceof Error ? error.message : "いいねの追加に失敗しました",
        code:
          typeof error === "object" && error !== null && "code" in error
            ? (error.code as string)
            : "unknown",
      };
      throw apiError;
    }
  }

  // チェックポイントのいいねを取り消す
  static async unlikeCheckPoint(
    checkPointId: number,
    profileId: string,
  ): Promise<void> {
    try {
      // いいねを削除
      const { error } = await supabase
        .from("check_point_likes")
        .delete()
        .eq("check_point_id", checkPointId)
        .eq("profile_id", profileId);

      if (error) {
        console.error("Unlike check point error:", error);
        handleSupabaseError(error, "いいねの取り消しに失敗しました");
      }
    } catch (error: unknown) {
      console.error("Unlike check point error:", error);
      // 未知のエラーの場合
      const apiError = {
        message:
          error instanceof Error
            ? error.message
            : "いいねの取り消しに失敗しました",
        code:
          typeof error === "object" && error !== null && "code" in error
            ? (error.code as string)
            : "unknown",
      };
      throw apiError;
    }
  }
}
