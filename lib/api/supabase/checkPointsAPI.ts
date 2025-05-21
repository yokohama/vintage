import { supabase } from "@/lib/supabase";
import { CheckPointType, ApiErrorType, VintageType } from "@/lib/types";

export class checkPointsAPI {
  // データフォーマット用のヘルパー関数
  private static formatCheckPointData(data: {
    id: number;
    point: string;
    image_url: string;
    description: string | null;
    profile_id: string | null;
    created_at: string | null;
    vintages: {
      id: number;
      name: string | null;
      manufacturing_start_year: number;
      manufacturing_end_year: number;
      image_url: string;
      description: string | null;
      products: {
        id: number;
        name: string;
        image_url: string;
        description: string | null;
        brands: {
          id: number;
          name: string;
          image_url: string;
          description: string | null;
        };
      };
    };
  }): CheckPointType {
    const brandObj = {
      id: data.vintages.products.brands.id,
      name: data.vintages.products.brands.name,
      imageUrl: data.vintages.products.brands.image_url,
      description: data.vintages.products.brands.description || "",
      products: [],
    };

    const productObj = {
      id: data.vintages.products.id,
      brand: brandObj,
      name: data.vintages.products.name,
      imageUrl: data.vintages.products.image_url,
      description: data.vintages.products.description || "",
      vintages: [],
    };

    const vintageObj = {
      id: data.vintages.id,
      product: productObj,
      name: data.vintages.name || "", // nullの場合は空文字列を使用
      manufacturing_start_year: data.vintages.manufacturing_start_year,
      manufacturing_end_year: data.vintages.manufacturing_end_year,
      imageUrl: data.vintages.image_url,
      description: data.vintages.description || "",
      checkPoints: [],
    };

    return {
      id: data.id,
      vintage: vintageObj,
      point: data.point,
      imageUrl: data.image_url,
      description: data.description || "",
      profileId: data.profile_id,
      createdAt: data.created_at,
      isLiked: false,
      likeCount: 0,
    };
  }

  static async getCheckPoints(): Promise<CheckPointType[]> {
    const { data, error } = await supabase
      .from("check_points")
      .select("*, vintages(*, products(*))")
      .is("deleted_at", null)
      .order("updated_at", { ascending: false });

    if (error) {
      const apiError: ApiErrorType = {
        message: error.message,
        code: error.code,
      };
      throw apiError;
    }

    // データベースのカラム名をCheckPointTypeのプロパティ名に変換
    const formattedData: CheckPointType[] = (data || []).map(
      (item: {
        id: number;
        point: string;
        image_url: string;
        description: string | null;
        profile_id: string | null;
        created_at: string | null;
        vintages: {
          id: number;
          name: string | null;
          manufacturing_start_year: number;
          manufacturing_end_year: number;
          image_url: string;
          description: string | null;
          product_id: number;
          products: {
            id: number;
            name: string;
            image_url: string;
            description: string | null;
            brand_id: number;
          };
        };
      }) => {
        // vintageオブジェクトを変換
        const vintageData = item.vintages;
        const vintage: VintageType = {
          id: vintageData.id,
          name: vintageData.name || "", // nullの場合は空文字列を使用
          manufacturing_start_year: vintageData.manufacturing_start_year,
          manufacturing_end_year: vintageData.manufacturing_end_year,
          imageUrl: vintageData.image_url,
          description: vintageData.description || "",
          checkPoints: [], // 循環参照を避けるため空配列を設定
          product: {
            id: vintageData.product_id,
            name: vintageData.products?.name || "",
            imageUrl: vintageData.products?.image_url || "",
            description: vintageData.products?.description || "",
            vintages: [], // 循環参照を避けるため空配列を設定
            brand: {
              id: vintageData.products?.brand_id || 0,
              name: "",
              imageUrl: "",
              description: "",
              products: [],
            },
          },
        };

        return {
          id: item.id,
          point: item.point,
          imageUrl: item.image_url,
          description: item.description || "",
          profileId: item.profile_id,
          createdAt: item.created_at,
          vintage: vintage,
          isLiked: false,
          likeCount: 0,
        };
      },
    );

    return formattedData;
  }

  static async getCheckPointsByVintageId(): Promise<CheckPointType[]> {
    const { data, error } = await supabase
      .from("check_points")
      .select("*, vintages(*, products(*))")
      .is("deleted_at", null)
      .order("updated_at", { ascending: false });

    if (error) {
      const apiError: ApiErrorType = {
        message: error.message,
        code: error.code,
      };
      throw apiError;
    }

    // データベースのカラム名をCheckPointTypeのプロパティ名に変換
    const formattedData: CheckPointType[] = (data || []).map(
      (item: {
        id: number;
        point: string;
        image_url: string;
        description: string | null;
        profile_id: string | null;
        created_at: string | null;
        vintages: {
          id: number;
          name: string | null;
          manufacturing_start_year: number;
          manufacturing_end_year: number;
          image_url: string;
          description: string | null;
          product_id: number;
          products: {
            id: number;
            name: string;
            image_url: string;
            description: string | null;
            brand_id: number;
          };
        };
      }) => {
        // vintageオブジェクトを変換
        const vintageData = item.vintages;
        const vintage: VintageType = {
          id: vintageData.id,
          name: vintageData.name || "", // nullの場合は空文字列を使用
          manufacturing_start_year: vintageData.manufacturing_start_year,
          manufacturing_end_year: vintageData.manufacturing_end_year,
          imageUrl: vintageData.image_url,
          description: vintageData.description || "",
          checkPoints: [], // 循環参照を避けるため空配列を設定
          product: {
            id: vintageData.product_id,
            name: vintageData.products?.name || "",
            imageUrl: vintageData.products?.image_url || "",
            description: vintageData.products?.description || "",
            vintages: [], // 循環参照を避けるため空配列を設定
            brand: {
              id: vintageData.products?.brand_id || 0,
              name: "",
              imageUrl: "",
              description: "",
              products: [],
            },
          },
        };

        return {
          id: item.id,
          point: item.point,
          imageUrl: item.image_url,
          description: item.description || "",
          profileId: item.profile_id,
          createdAt: item.created_at,
          vintage: vintage,
          isLiked: false,
          likeCount: 0,
        };
      },
    );

    return formattedData;
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
        .select("*, vintages(*, products(*, brands(*)))")
        .single();

      if (error) {
        console.error("Supabase error:", error);
        const apiError: ApiErrorType = {
          message:
            error instanceof Error
              ? error.message
              : "チェックポイントの追加に失敗しました",
          code: "unknown",
        };
        throw apiError;
      }

      return this.formatCheckPointData(data);
    } catch (error: unknown) {
      console.error("Supabase error:", error);
      const apiError: ApiErrorType = {
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

    if (error) {
      console.error("Storage upload error:", error);
      throw new Error(`画像のアップロードに失敗しました: ${error.message}`);
    }

    // 公開URLを取得
    const {
      data: { publicUrl },
    } = supabase.storage.from("images").getPublicUrl(filePath);
    return publicUrl;
  }
}
