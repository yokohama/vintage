"use client";

import { createContext, useContext, useState, useCallback } from "react";
import { UserProfileType } from "@/lib/types";

type ProfileContextType = {
  updatedProfile: UserProfileType | null;
  updateProfile: (profile: UserProfileType) => void;
  resetUpdatedProfile: () => void;
};

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export const ProfileProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [updatedProfile, setUpdatedProfile] = useState<UserProfileType | null>(
    null,
  );

  const updateProfile = useCallback((profile: UserProfileType) => {
    setUpdatedProfile(profile);
  }, []);

  const resetUpdatedProfile = useCallback(() => {
    setUpdatedProfile(null);
  }, []);

  return (
    <ProfileContext.Provider
      value={{ updatedProfile, updateProfile, resetUpdatedProfile }}
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
