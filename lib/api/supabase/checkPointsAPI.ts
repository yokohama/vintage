import { supabase } from "@/lib/supabase";
import { CheckPointType } from "@/lib/types";
import {
  mapCheckPoint,
  processSupabaseArrayResponse,
  processSupabaseResponse,
  mapIsLiked,
} from "./utils/formatHelper";
import { SupabaseCheckPointType } from "./utils/types";
import { throwError } from "@/lib/error";

export class checkPointsAPI {
  static useLimit = (page: number, limit: number) => {
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    return {
      from,
      to,
    };
  };

  static async getCheckPoints(
    userId?: string,
    page: number = 1,
    limit: number = 10,
  ): Promise<CheckPointType[]> {
    const { from, to } = checkPointsAPI.useLimit(page, limit);

    const { data, error } = await supabase
      .from("check_points")
      .select(
        "*, vintage:vintage_id(*, product:product_id(*)), profiles(*), check_point_likes(count)",
      )
      .is("deleted_at", null)
      .order("updated_at", { ascending: false })
      .range(from, to);

    const checkPoints = processSupabaseArrayResponse<
      SupabaseCheckPointType,
      CheckPointType
    >(data, error, mapCheckPoint);

    // ユーザーIDが提供されている場合、いいね状態を別クエリで取得
    if (userId && checkPoints.length > 0) {
      return await mapIsLiked(checkPoints, userId);
    }

    return checkPoints;
  }

  static async getCheckPointsByVintageId(
    vintageId: number,
    userId?: string,
    page: number = 1,
    limit: number = 10,
  ): Promise<CheckPointType[]> {
    const { from, to } = checkPointsAPI.useLimit(page, limit);

    const { data, error } = await supabase
      .from("check_points")
      .select(
        "*, vintage:vintage_id(*, product:product_id(*)), profiles(*), check_point_likes(count)",
      )
      .eq("vintage_id", vintageId)
      .is("deleted_at", null)
      .order("updated_at", { ascending: false })
      .range(from, to);

    const checkPoints = processSupabaseArrayResponse<
      SupabaseCheckPointType,
      CheckPointType
    >(data, error, mapCheckPoint);

    // ユーザーIDが提供されている場合、いいね状態を別クエリで取得
    if (userId && checkPoints.length > 0) {
      return await mapIsLiked(checkPoints, userId);
    }

    // ユーザーIDがない場合はいいね状態をfalseに設定
    return checkPoints.map((cp) => ({
      ...cp,
      isLiked: false,
    }));
  }

  static async getCheckPointsByProfileId(
    profileId: string,
    userId?: string,
    page: number = 1,
    limit: number = 10,
  ): Promise<CheckPointType[]> {
    const { from, to } = checkPointsAPI.useLimit(page, limit);

    const { data, error } = await supabase
      .from("check_points")
      .select("*, profiles(*), check_point_likes(count)")
      .eq("profile_id", profileId)
      .is("deleted_at", null)
      .order("updated_at", { ascending: false })
      .range(from, to);

    const checkPoints = processSupabaseArrayResponse<
      SupabaseCheckPointType,
      CheckPointType
    >(data, error, mapCheckPoint);

    // ユーザーIDが提供されている場合、いいね状態を別クエリで取得
    if (userId && checkPoints.length > 0) {
      return await mapIsLiked(checkPoints, userId);
    }

    return checkPoints;
  }

  // 自分がいいねしているものを取得なので、userIDは必須
  static async getCheckPointsByLied(
    userId: string,
    page: number = 1,
    limit: number = 10,
  ): Promise<CheckPointType[]> {
    const { from, to } = checkPointsAPI.useLimit(page, limit);

    // ユーザーがいいねした鑑定ポイントのIDを取得
    const { data: likedCheckPointsData, error: likedError } = await supabase
      .from("check_point_likes")
      .select("check_point_id")
      .eq("profile_id", userId)
      .is("deleted_at", null)
      .order("created_at", { ascending: false })
      .range(from, to);

    if (likedError) {
      throwError(likedError, "いいねした鑑定ポイントの取得に失敗しました");
    }

    // いいねした鑑定ポイントがない場合は空配列を返す
    if (!likedCheckPointsData || likedCheckPointsData.length === 0) {
      return [];
    }

    // いいねした鑑定ポイントのIDを抽出
    const checkPointIds = likedCheckPointsData.map(
      (like) => like.check_point_id,
    );

    // 鑑定ポイントの詳細情報を取得
    const { data, error } = await supabase
      .from("check_points")
      .select(
        "*, vintage:vintage_id(*, product:product_id(*)), profiles(*), check_point_likes(count)",
      )
      .in("id", checkPointIds)
      .is("deleted_at", null)
      .order("updated_at", { ascending: false });

    const checkPoints = processSupabaseArrayResponse<
      SupabaseCheckPointType,
      CheckPointType
    >(data, error, mapCheckPoint);

    // いいね状態を設定（自分がいいねしたものなので全てtrue）
    return checkPoints.map((cp) => ({
      ...cp,
      isLiked: true,
    }));
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
          profile_id: userId,
        })
        .select(
          "*, vintage:vintage_id(*, product:product_id(*, brand:brand_id(*))), profiles(*)",
        )
        .single();

      return processSupabaseResponse<SupabaseCheckPointType, CheckPointType>(
        data,
        error,
        mapCheckPoint,
        "チェックポイント",
      );
    } catch (error: unknown) {
      if (error) {
        throwError(error, "チェックポイントの追加で不明なエラーが発生しました");
      }
    }

    // 明示的にneverを返すことを示す
    throw new Error("This code will never be executed");
  }

  // チェックポイントを削除する
  static async deleteCheckPoint(checkPointId: number): Promise<void> {
    try {
      const { error } = await supabase
        .from("check_points")
        .update({ deleted_at: new Date().toISOString() })
        .eq("id", checkPointId);

      if (error) {
        throwError(error, "チェックポイントの削除に失敗しました");
      }
    } catch (error: unknown) {
      if (error) {
        throwError(error, "チェックポイントの削除で不明なエラーが発せいました");
      }
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
        throwError(error, "いいねの追加に失敗しました");
      }
    } catch (error: unknown) {
      if (error) {
        throwError(error, "いいねの追加で不明なエラーが発生しました");
      }
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
        throwError(error, "いいねの取り消しに失敗しました");
      }
    } catch (error: unknown) {
      if (error) {
        throwError(error, "いいねの取り消しにで不明なエラーが発せいました");
      }
    }
  }
}
