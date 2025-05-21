import { supabase } from "@/lib/supabase";
import { UserProfileType, ApiErrorType } from "@/lib/types";

interface SupabaseProfileType {
  id: string;
  display_name: string | null;
  email: string | null;
  avatar_url: string | null;
  website_url: string | null;
  twitter_url: string | null;
  instagram_url: string | null;
  facebook_url: string | null;
  linkedin_url: string | null;
  youtube_url: string | null;
  deleted_at: string | null;
}

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
      const apiError: ApiErrorType = {
        message: "認証されたユーザーが見つかりません",
        code: "auth/user-not-found",
      };
      throw apiError;
    }

    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    if (error) {
      throw error;
    }

    return mapUserProfile(data);
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
