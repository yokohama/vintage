"use client";

import Header from "@/components/ui/Header";
import Footer from "@/components/ui/Footer";
import PageTitle from "@/components/ui/PageTitle";
import Spinner from "@/components/ui/Spinner";
import Error from "@/components/ui/Error";
import NotFound from "@/components/ui/NotFound";
import List from "@/components/ui/checkpoint/List";
import { useProfile } from "@/hooks/useProfile";

export default function Likes() {
  const { profile, loading, error } = useProfile();

  return (
    <main>
      <div>
        <Header />
        <PageTitle title="お気入り一覧" />
        {loading ? (
          <Spinner />
        ) : error ? (
          <Error />
        ) : !profile ? (
          <NotFound msg="お気入りが見つかりませんでした。" />
        ) : (
          <List likedUserId={profile.id} />
        )}
        <Footer />
      </div>
    </main>
  );
}
