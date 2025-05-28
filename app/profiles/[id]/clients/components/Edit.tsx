"use client";

import Image from "next/image";
import { siteConfig } from "@/lib/config/siteConfig";

import { useEdit } from "../hooks/useEdit";
import Spinner from "@/components/ui/Spinner";
import {
  Sns,
  globe,
  twitter,
  instagram,
  facebook,
  linkedin,
  youtube,
} from "@/components/ui/Sns";

type EditProps = {
  profileId: string;
};

export default function Edit({ profileId }: EditProps) {
  const {
    handleSubmit,
    previewImage,
    handleChange,
    handleImageChange,
    loading,
    formData,
    saving,
    router,
  } = useEdit({ profileId });

  return (
    <>
      {loading ? (
        <Spinner />
      ) : (
        <div className="container mx-auto px-4 py-8">
          <form
            onSubmit={handleSubmit}
            className="bg-amber-50 rounded-lg shadow-md p-6 mb-8 border border-amber-100"
          >
            {/* プロフィール画像 */}
            <div className="mb-6 flex flex-col items-center">
              <div className="w-32 h-32 relative rounded-full overflow-hidden border-4 border-amber-200 shadow-md mb-4">
                <Image
                  src={previewImage || siteConfig.images.defaultProfileAvatar}
                  alt="プロフィール画像"
                  fill
                  sizes="(max-width: 640px) 100vw, 33vw"
                  className="object-cover"
                  unoptimized={
                    previewImage?.includes("api.dicebear.com") || false
                  }
                />
              </div>

              <label className="bg-amber-600 hover:bg-amber-700 text-white text-sm px-4 py-2 rounded-md shadow-sm cursor-pointer">
                画像を変更
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
            </div>

            <div className="mb-6">
              <label className="block text-amber-800 font-medium mb-2">
                表示名 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="displayName"
                value={formData.displayName}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-amber-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div className="mb-6">
              <label className="block text-amber-800 font-medium mb-2">
                プロフィール <span className="text-red-500">*</span>
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                rows={4}
                className="w-full px-4 py-2 border border-amber-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-amber-800 border-b border-amber-200 pb-2 mb-4">
                SNSリンク
              </h3>

              <Sns
                snsService={globe}
                handleChange={handleChange}
                value={formData.websiteUrl || ""}
              />
              <Sns
                snsService={twitter}
                handleChange={handleChange}
                value={formData.twitterUrl || ""}
              />
              <Sns
                snsService={instagram}
                handleChange={handleChange}
                value={formData.instagramUrl || ""}
              />
              <Sns
                snsService={facebook}
                handleChange={handleChange}
                value={formData.facebookUrl || ""}
              />
              <Sns
                snsService={linkedin}
                handleChange={handleChange}
                value={formData.linkedinUrl || ""}
              />
              <Sns
                snsService={youtube}
                handleChange={handleChange}
                value={formData.youtubeUrl || ""}
              />

              {/* ボタン */}
              <div className="mt-8 flex justify-between">
                <button
                  type="button"
                  onClick={() => router.back()}
                  className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-6 py-2 rounded-md shadow-sm"
                >
                  キャンセル
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="bg-amber-600 hover:bg-amber-700 text-white px-6 py-2 rounded-md shadow-sm flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {saving ? (
                    <>
                      <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>
                      保存中...
                    </>
                  ) : (
                    "保存する"
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      )}
    </>
  );
}
