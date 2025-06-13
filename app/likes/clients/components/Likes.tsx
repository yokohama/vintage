"use client";

import Header from "@/components/ui/Header";
import Footer from "@/components/ui/Footer";
import PageTitle from "@/components/ui/PageTitle";
import Spinner from "@/components/ui/Spinner";
import List from "@/components/ui/checkpoint/List";
import { useProfile } from "@/hooks/useProfile";

export default function Likes() {
  const { profile, loading } = useProfile();

  return (
    <main>
      <div>
        <Header />
        <PageTitle title="お気入り一覧" />
        {loading ? <Spinner /> : profile && <List likedUserId={profile.id} />}
        <Footer />
      </div>
    </main>
  );
}
