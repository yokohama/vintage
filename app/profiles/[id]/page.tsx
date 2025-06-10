import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import Header from "@/components/ui/Header";
import Footer from "@/components/ui/Footer";
import PageTitle from "@/components/ui/PageTitle";
import Error from "@/components/ui/Error";
import NotFound from "@/components/ui/NotFound";
import Spinner from "@/components/ui/Spinner";
import { profilesParams } from "../utils/profilesParams";
import { AddButton } from "@/components/ui/OriginalButton";
import { siteConfig } from "@/lib/config/siteConfig";
import List from "@/components/ui/checkpoint/List";
import ToastHandler from "@/components/ui/ToastHandler";
import {
  Globe,
  Twitter,
  Instagram,
  Facebook,
  Linkedin,
  Youtube,
} from "lucide-react";

// キャッシュを無効化して常に最新データを取得
export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function ProfilePage({
  params,
}: {
  params: { id: string };
}) {
  const { profile, error } = await profilesParams(params);

  return (
    <main>
      <div>
        <Header />
        <ToastHandler
          successMsg="プロフィールを更新しました。"
          errorMsg="プロフィールの更新に失敗しました。"
        />
        {error ? (
          <Error />
        ) : !profile ? (
          <NotFound msg="プロフィールが見つかりませんでした。" />
        ) : (
          <>
            <PageTitle title={profile.displayName!} />
            <Suspense fallback={<Spinner />}>
              <div className="container mx-auto px-4 py-8">
                <div className="flex justify-end mb-6">
                  <Link href={`/profiles/${profile.id}/edit`}>
                    <AddButton
                      label="プロフィール編集"
                      className="bg-amber-600 hover:bg-amber-700 text-white text-sm px-4 py-2 rounded-md shadow-sm"
                    />
                  </Link>
                </div>

                <div className="bg-amber-50 rounded-lg shadow-md p-6 mb-8 border border-amber-100">
                  <div className="flex flex-col items-center gap-8">
                    <div className="w-32 h-32 relative rounded-full overflow-hidden border-4 border-amber-200 shadow-md">
                      <Image
                        src={
                          profile.avatarUrl ||
                          siteConfig.images.defaultProfileAvatar
                        }
                        alt={profile.displayName || "プロフィール画像"}
                        fill
                        sizes="(max-width: 640px) 100vw, 33vw"
                        className="object-cover"
                        unoptimized={
                          profile.avatarUrl?.includes("api.dicebear.com") ||
                          false
                        }
                      />
                    </div>
                    <div className="description w-full max-w-2xl text-center">
                      {profile.description}
                    </div>

                    <div className="w-full">
                      <div className="">
                        <div className="flex flex-wrap gap-4 justify-center">
                          {/* ウェブサイト */}
                          {profile.websiteUrl ? (
                            <Link
                              href={profile.websiteUrl}
                              className="transition-transform hover:scale-110"
                              target="_blank"
                              title={profile.websiteUrl}
                            >
                              <Globe size={28} className="text-rose-600" />
                            </Link>
                          ) : (
                            <Globe size={28} className="text-rose-200" />
                          )}

                          {/* Twitter */}
                          {profile.twitterUrl ? (
                            <Link
                              href={profile.twitterUrl}
                              className="transition-transform hover:scale-110"
                              target="_blank"
                              title={profile.twitterUrl}
                            >
                              <Twitter size={28} className="text-rose-600" />
                            </Link>
                          ) : (
                            <Twitter size={28} className="text-rose-200" />
                          )}

                          {/* Instagram */}
                          {profile.instagramUrl ? (
                            <Link
                              href={profile.instagramUrl}
                              className="transition-transform hover:scale-110"
                              target="_blank"
                              title={profile.instagramUrl}
                            >
                              <Instagram size={28} className="text-rose-600" />
                            </Link>
                          ) : (
                            <Instagram size={28} className="text-rose-200" />
                          )}

                          {/* Facebook */}
                          {profile.facebookUrl ? (
                            <Link
                              href={profile.facebookUrl}
                              className="transition-transform hover:scale-110"
                              target="_blank"
                              title={profile.facebookUrl}
                            >
                              <Facebook size={28} className="text-rose-600" />
                            </Link>
                          ) : (
                            <Facebook size={28} className="text-rose-200" />
                          )}

                          {/* LinkedIn */}
                          {profile.linkedinUrl ? (
                            <Link
                              href={profile.linkedinUrl}
                              className="transition-transform hover:scale-110"
                              target="_blank"
                              title={profile.linkedinUrl}
                            >
                              <Linkedin size={28} className="text-rose-600" />
                            </Link>
                          ) : (
                            <Linkedin size={28} className="text-rose-200" />
                          )}

                          {/* YouTube */}
                          {profile.youtubeUrl ? (
                            <Link
                              href={profile.youtubeUrl}
                              className="transition-transform hover:scale-110"
                              target="_blank"
                              title={profile.youtubeUrl}
                            >
                              <Youtube size={28} className="text-rose-700" />
                            </Link>
                          ) : (
                            <Youtube size={28} className="text-rose-200" />
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <List
                  profileId={profile.id}
                  profileName={profile.displayName ? profile.displayName : ""}
                />
              </div>
            </Suspense>
          </>
        )}
        <Footer />
      </div>
    </main>
  );
}
