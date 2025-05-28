"use client";

import Header from "@/components/ui/Header";
import Footer from "@/components/ui/Footer";
import PageTitle from "@/components/ui/PageTitle";
import Edit from "../clients/components/Edit";

export default function ProfileEditPage({
  params,
}: {
  params: { id: string };
}) {
  return (
    <main>
      <Header />
      <PageTitle title="プロフィール編集" />
      <Edit profileId={params.id} />

      <Footer />
    </main>
  );
}
