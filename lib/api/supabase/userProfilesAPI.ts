import { supabase } from "@/lib/supabase";
import { UserProfileType } from "@/lib/types";
import { SupabaseProfileType } from "./utils/types";
import {
  handleSupabaseError,
  processSupabaseResponse,
} from "./utils/formatHelper";

const mapUserProfile = (data: SupabaseProfileType): UserProfileType => {
  return {
    id: data.id,
    displayName: data.display_name,
    email: data.email,
    avatarUrl: data.avatar_url,
    websiteUrl: data.website_url,
    twitterUrl: data.twitter_url,
    instagramUrl: data.instagram_url,
    facebookUrl: data.facebook_url,
    linkedinUrl: data.linkedin_url,
    youtubeUrl: data.youtube_url,
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
      .select("*")
      .eq("id", userId)
      .single();

    return processSupabaseResponse(data, error, mapUserProfile, "プロフィール");
  }

  static async getUserProfile(id: string): Promise<UserProfileType> {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      throw error;
    }

    return mapUserProfile(data);
  }
}
