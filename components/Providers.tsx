"use client";

import { AuthProvider } from "@/contexts/AuthContext";
import { ProfileProvider } from "@/contexts/ProfileContext";
import { PageTitleProvider } from "@/contexts/PageTitleContext";
import { InfiniteScrollProvider } from "@/contexts/InfiniteScrollContext";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <ProfileProvider>
        <PageTitleProvider>
          <InfiniteScrollProvider>{children}</InfiniteScrollProvider>
        </PageTitleProvider>
      </ProfileProvider>
    </AuthProvider>
  );
}
