import { useState, useEffect } from "react";
import { UserProfileType } from "@/lib/types";

export const useUserProfile = () => {
  const [userProfile, setUserProfile] = useState<UserProfileType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        // 実際のAPI呼び出しをここに実装
        // 例: const response = await fetch('/api/profile');
        // const data = await response.json();

        // 仮のデータを返す（実際の実装では削除してください）
        const mockProfile: UserProfileType = {
          id: "user123",
          displayName: "テストユーザー",
          email: "test@example.com",
          avatarUrl: null,
        };

        setUserProfile(mockProfile);
      } catch (err) {
        setError(err instanceof Error ? err : new Error("Unknown error"));
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  return {
    userProfile,
    isLoading,
    error,
    setUserProfile,
  };
};
