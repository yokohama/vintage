import { supabase } from "@/lib/supabase";
import { UserProfileType } from "@/lib/types";
import { SupabaseProfileType } from "./utils/types";
import {
  handleSupabaseError,
  processSupabaseResponse,
  mapCheckPointLike,
} from "./utils/formatHelper";

const mapUserProfile = (data: SupabaseProfileType): UserProfileType => {
  return {
    id: data.id,
    displayName: data.display_name,
    description: data.description,
    email: data.email,
    avatarUrl: data.avatar_url,
    websiteUrl: data.website_url,
    twitterUrl: data.twitter_url,
    instagramUrl: data.instagram_url,
    facebookUrl: data.facebook_url,
    linkedinUrl: data.linkedin_url,
    youtubeUrl: data.youtube_url,
    checkPointLikes: data.check_point_likes?.map(mapCheckPointLike) || [],
  };
};

export class userProfilesAPI {
  static async getCurrentUserProfile(): Promise<UserProfileType> {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      handleSupabaseError({
        message: "認証されたユーザーが見つかりません",
        code: "auth/user-not-found",
      });
    }

    // この時点でuserはnullではないことが確定しているため、型アサーションを使用
    const userId = user!.id;

    const { data, error } = await supabase
      .from("profiles")
      .select(
        "*, check_point_likes(*, check_points(*, profiles(*), check_point_likes(count)))",
      )
      .eq("id", userId)
      .single();

    return processSupabaseResponse(data, error, mapUserProfile, "プロフィール");
  }

  static async getUserProfile(id: string): Promise<UserProfileType> {
    const { data, error } = await supabase
      .from("profiles")
      .select(
        "*, check_point_likes(*, check_points(*, profiles(*), check_point_likes(count)))",
      )
      .eq("id", id)
      .single();

    if (error) {
      throw error;
    }

    return processSupabaseResponse(data, error, mapUserProfile, "プロフィール");
  }

  static async updateProfile(
    id: string,
    profileData: Partial<UserProfileType>,
  ) {
    try {
      // スネークケースに変換
      const updateData = {
        display_name: profileData.displayName,
        description: profileData.description,
        avatar_url: profileData.avatarUrl,
        website_url: profileData.websiteUrl,
        twitter_url: profileData.twitterUrl,
        instagram_url: profileData.instagramUrl,
        facebook_url: profileData.facebookUrl,
        linkedin_url: profileData.linkedinUrl,
        youtube_url: profileData.youtubeUrl,
      };

      const { error } = await supabase
        .from("profiles")
        .update(updateData)
        .eq("id", id);

      return { error };
    } catch (error) {
      console.error("プロフィール更新エラー:", error);
      return {
        error: { message: "プロフィールの更新に失敗しました" },
      };
    }
  }

  static async uploadAvatar(id: string, file: File) {
    try {
      // ファイル名を生成（ユニークにするためにタイムスタンプを追加）
      const fileExt = file.name.split(".").pop();
      const fileName = `${id}-${Date.now()}.${fileExt}`;
      const filePath = `avatars/${fileName}`;

      // Storageにアップロード
      const { error: uploadError } = await supabase.storage
        .from("images")
        .upload(filePath, file);

      if (uploadError) {
        console.log(uploadError);
        return { data: null, error: uploadError };
      }

      // 公開URLを取得
      const {
        data: { publicUrl },
      } = supabase.storage.from("images").getPublicUrl(filePath);

      // プロフィールのavatar_urlを更新
      const { error: updateError } = await supabase
        .from("profiles")
        .update({ avatar_url: publicUrl })
        .eq("id", id);

      if (updateError) {
        return { data: null, error: updateError };
      }

      return {
        data: { avatarUrl: publicUrl },
        error: null,
      };
    } catch (error) {
      console.error("アバターアップロードエラー:", error);
      return {
        data: null,
        error: { message: "プロフィール画像のアップロードに失敗しました" },
      };
    }
  }
}
