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
import { checkPointsAPI } from "@/lib/api/supabase/checkPointsAPI";
import { CheckPointType } from "@/lib/types";
import { Standerd } from "@/components/ui/OriginalButton";
import { siteConfig } from "@/lib/config/siteConfig";
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
  let checkPoints: CheckPointType[] = [];

  if (profile) {
    checkPoints = await checkPointsAPI.getCheckPointsByProfileId(profile.id);
  }

  return (
    <main>
      <div>
        <Header />
        {error ? (
          <Error />
        ) : !profile ? (
          <NotFound msg="プロフィールが見つかりませんでした。" />
        ) : (
          <>
            <PageTitle title={`${profile.displayName}のプロフィール`} />
            <Suspense fallback={<Spinner />}>
              <div className="container mx-auto px-4 py-8">
                <div className="flex justify-end mb-6">
                  <Link href={`/profiles/${profile.id}/edit`}>
                    <Standerd
                      label="プロフィール編集"
                      className="bg-amber-600 hover:bg-amber-700 text-white text-sm px-4 py-2 rounded-md shadow-sm"
                    />
                  </Link>
                </div>

                <div className="bg-amber-50 rounded-lg shadow-md p-6 mb-8 border border-amber-100">
                  <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                    <div className="w-32 h-32 relative rounded-full overflow-hidden border-4 border-amber-200 shadow-md">
                      <Image
                        src={
                          profile.avatarUrl ||
                          siteConfig.images.defaultProfileAvatar
                        }
                        alt={profile.displayName || "プロフィール画像"}
                        fill
                        className="object-cover"
                        unoptimized={
                          profile.avatarUrl?.includes("api.dicebear.com") ||
                          false
                        }
                      />
                    </div>
                    <h2 className="text-2xl font-bold text-amber-800">
                      {profile.displayName}
                    </h2>

                    <div className="flex-1">
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
                              <Globe size={28} className="text-amber-700" />
                            </Link>
                          ) : (
                            <Globe size={28} className="text-amber-300" />
                          )}

                          {/* Twitter */}
                          {profile.twitterUrl ? (
                            <Link
                              href={profile.twitterUrl}
                              className="transition-transform hover:scale-110"
                              target="_blank"
                              title={profile.twitterUrl}
                            >
                              <Twitter size={28} className="text-amber-700" />
                            </Link>
                          ) : (
                            <Twitter size={28} className="text-amber-300" />
                          )}

                          {/* Instagram */}
                          {profile.instagramUrl ? (
                            <Link
                              href={profile.instagramUrl}
                              className="transition-transform hover:scale-110"
                              target="_blank"
                              title={profile.instagramUrl}
                            >
                              <Instagram size={28} className="text-amber-700" />
                            </Link>
                          ) : (
                            <Instagram size={28} className="text-amber-300" />
                          )}

                          {/* Facebook */}
                          {profile.facebookUrl ? (
                            <Link
                              href={profile.facebookUrl}
                              className="transition-transform hover:scale-110"
                              target="_blank"
                              title={profile.facebookUrl}
                            >
                              <Facebook size={28} className="text-amber-700" />
                            </Link>
                          ) : (
                            <Facebook size={28} className="text-amber-300" />
                          )}

                          {/* LinkedIn */}
                          {profile.linkedinUrl ? (
                            <Link
                              href={profile.linkedinUrl}
                              className="transition-transform hover:scale-110"
                              target="_blank"
                              title={profile.linkedinUrl}
                            >
                              <Linkedin size={28} className="text-amber-700" />
                            </Link>
                          ) : (
                            <Linkedin size={28} className="text-amber-300" />
                          )}

                          {/* YouTube */}
                          {profile.youtubeUrl ? (
                            <Link
                              href={profile.youtubeUrl}
                              className="transition-transform hover:scale-110"
                              target="_blank"
                              title={profile.youtubeUrl}
                            >
                              <Youtube size={28} className="text-amber-700" />
                            </Link>
                          ) : (
                            <Youtube size={28} className="text-amber-300" />
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <h2 className="text-2xl font-bold text-amber-800 mb-6 border-b-2 border-amber-200 pb-2">
                  投稿したチェックポイント ({checkPoints.length})
                </h2>

                {checkPoints.length === 0 ? (
                  <NotFound msg="チェックポイントがまだありません。" />
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
                    {checkPoints.map((cp, index) => {
                      return (
                        <div
                          key={index}
                          className="bg-amber-50 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 border border-amber-100"
                        >
                          <div className="relative h-48 w-full overflow-hidden">
                            {cp.point && (
                              <div className="absolute top-2 right-2 z-10 bg-amber-800 text-white py-1 px-2 rounded-md text-sm font-bold shadow-sm">
                                {cp.point}
                              </div>
                            )}
                            <Image
                              src={cp.imageUrl}
                              alt={cp.point || "チェックポイント画像"}
                              fill
                              className="object-cover sepia-[0.15] brightness-[0.98] hover:scale-105 transition-transform duration-300"
                              priority={true}
                            />
                          </div>
                          <div className="p-4">
                            <p className="text-sm text-stone-600 leading-relaxed italic">
                              {cp.description}
                            </p>

                            {cp.vintage && (
                              <div className="mt-4 pt-3 border-t border-amber-100">
                                <Link
                                  href={`/brands/${cp.vintage.product?.brand?.id}/products/${cp.vintage.product?.id}`}
                                  className="text-xs text-amber-700 hover:text-amber-800 italic flex items-center gap-1"
                                >
                                  <span className="inline-block w-2 h-2 bg-amber-600 rounded-full"></span>
                                  {cp.vintage.product?.brand?.name} -{" "}
                                  {cp.vintage.product?.name} ({cp.vintage.name})
                                </Link>
                              </div>
                            )}

                            <div className="mt-3 flex justify-end">
                              <span className="text-xs text-amber-400 italic">
                                {cp.createdAt
                                  ? new Date(cp.createdAt).toLocaleDateString(
                                    "ja-JP",
                                  )
                                  : ""}
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </Suspense>
          </>
        )}
        <Footer />
      </div>
    </main>
  );
}
