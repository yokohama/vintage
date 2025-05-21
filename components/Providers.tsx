"use client";

import { AuthProvider } from "@/contexts/AuthContext";
import { ProfileProvider } from "@/contexts/ProfileContext";
import { PageTitleProvider } from "@/contexts/PageTitleContext";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <ProfileProvider>
        <PageTitleProvider>{children}</PageTitleProvider>
      </ProfileProvider>
    </AuthProvider>
  );
}
