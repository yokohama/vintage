import { supabase } from "@/lib/supabase";
import { UserProfileType } from "@/lib/types";
import { SupabaseProfileType } from "./utils/types";
import { throwError } from "@/lib/error";
import {
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
      throwError(null, "認証したユーザーが見つかりません");
    }

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

    return processSupabaseResponse(data, error, mapUserProfile, "プロフィール");
  }

  static async updateProfile(
    id: string,
    profileData: Partial<UserProfileType>,
  ) {
    try {
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

      if (error) {
        throwError(null, "プロフィールの更新でエラーが発生しました");
      }
    } catch (error) {
      console.error("プロフィール更新エラー:", error);
      if (error) {
        throwError(null, "プロフィールの更新で不明なエラーが発生しました");
      }
    }
  }
}
