import { useEffect, useState } from "react";

import { userProfilesAPI } from "@/lib/api/supabase/userProfilesAPI";
import { UserProfileType, ApiErrorType } from "@/lib/types";

export const useProfile = () => {
  const [profile, setProfile] = useState<UserProfileType | null>(null);
  const [error, setError] = useState<ApiErrorType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profileData = await userProfilesAPI.getCurrentUserProfile();
        setProfile(profileData);
      } catch (err) {
        const apiError = err as Error | ApiErrorType;
        setError({
          message:
            "message" in apiError
              ? apiError.message
              : "プロフィールの取得中にエラーが発生しました",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  return {
    profile,
    error,
    loading,
  };
};
