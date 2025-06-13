import { useEffect, useState } from "react";

import { userProfilesAPI } from "@/lib/api/supabase/userProfilesAPI";
import { UserProfileType } from "@/lib/types";
import { throwError } from "@/lib/error";

export const useProfile = () => {
  const [profile, setProfile] = useState<UserProfileType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profileData = await userProfilesAPI.getCurrentUserProfile();
        setProfile(profileData);
      } catch (err) {
        throwError(err, "プロフィールの取得中にエラーが発生しました");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  return {
    profile,
    loading,
  };
};
