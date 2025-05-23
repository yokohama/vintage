"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from "react";
import { UserProfileType } from "@/lib/types";
import { useAuth } from "./AuthContext";
import { userProfilesAPI } from "@/lib/api/supabase/userProfilesAPI";

type ProfileContextType = {
  updatedProfile: UserProfileType | null;
  userProfile: UserProfileType | null;
  isLoading: boolean;
  error: Error | null;
  updateProfile: (profile: UserProfileType) => void;
  resetUpdatedProfile: () => void;
  refreshUserProfile: () => Promise<void>;
};

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export const ProfileProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { user } = useAuth();
  const [updatedProfile, setUpdatedProfile] = useState<UserProfileType | null>(
    null,
  );
  const [userProfile, setUserProfile] = useState<UserProfileType | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  const updateProfile = useCallback((profile: UserProfileType) => {
    setUpdatedProfile(profile);
  }, []);

  const resetUpdatedProfile = useCallback(() => {
    setUpdatedProfile(null);
  }, []);

  const refreshUserProfile = useCallback(async () => {
    if (!user) {
      setUserProfile(null);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const profile = await userProfilesAPI.getCurrentUserProfile();
      setUserProfile(profile);
    } catch (err) {
      console.error("プロフィール取得エラー:", err);
      setError(
        err instanceof Error
          ? err
          : new Error("プロフィール取得に失敗しました"),
      );
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  // ユーザーが変更されたときにプロフィールを取得
  useEffect(() => {
    refreshUserProfile();
  }, [refreshUserProfile]);

  return (
    <ProfileContext.Provider
      value={{
        updatedProfile,
        userProfile,
        isLoading,
        error,
        updateProfile,
        resetUpdatedProfile,
        refreshUserProfile,
      }}
    >
      {children}
    </ProfileContext.Provider>
  );
};

export const useProfileContext = () => {
  const context = useContext(ProfileContext);
  if (context === undefined) {
    throw new Error("useProfileContext must be used within a ProfileProvider");
  }
  return context;
};

/**
 * 現在ログインしているユーザーのプロフィール情報を取得するためのフック
 * @returns ユーザープロフィール情報と関連する状態
 */
export const useUserProfile = () => {
  const { userProfile, isLoading, error, refreshUserProfile } =
    useProfileContext();

  return {
    userProfile,
    isLoading,
    error,
    refreshUserProfile,
  };
};
