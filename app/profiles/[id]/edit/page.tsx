"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Header from "@/components/ui/Header";
import Footer from "@/components/ui/Footer";
import PageTitle from "@/components/ui/PageTitle";
import Spinner from "@/components/ui/Spinner";
import { siteConfig, siteUrls } from "@/lib/config/siteConfig";
import { userProfilesAPI } from "@/lib/api/supabase/userProfilesAPI";
import { UserProfileType } from "@/lib/types";
import {
  Globe,
  Twitter,
  Instagram,
  Facebook,
  Linkedin,
  Youtube,
} from "lucide-react";

export default function ProfileEditPage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfileType | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);

  // フォームの状態
  const [formData, setFormData] = useState({
    displayName: "",
    websiteUrl: "",
    twitterUrl: "",
    instagramUrl: "",
    facebookUrl: "",
    linkedinUrl: "",
    youtubeUrl: "",
  });

  // プロフィールデータの取得
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await userProfilesAPI.getUserProfile(params.id);
        if (data) {
          setProfile(data);
          setFormData({
            displayName: data.displayName || "",
            websiteUrl: data.websiteUrl || "",
            twitterUrl: data.twitterUrl || "",
            instagramUrl: data.instagramUrl || "",
            facebookUrl: data.facebookUrl || "",
            linkedinUrl: data.linkedinUrl || "",
            youtubeUrl: data.youtubeUrl || "",
          });
          setPreviewImage(
            data.avatarUrl || siteConfig.images.defaultProfileAvatar,
          );
        }
      } catch {
        router.push(`/profiles/${params.id}?t=${Date.now()}&error=true`);
        router.refresh();
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [params.id]);

  // 入力フィールドの変更ハンドラ
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const errorRedirect = () => {
    router.push(`${siteUrls.profile(params.id)}?t=${Date.now()}&error=true`);
    router.refresh();
  };

  // 画像アップロードハンドラ
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);

      // プレビュー用のURL生成
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // フォーム送信ハンドラ
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      let avatarUrl = profile?.avatarUrl || "";

      // 画像がアップロードされた場合
      if (imageFile) {
        const { data: uploadData, error: uploadError } =
          await userProfilesAPI.uploadAvatar(params.id, imageFile);

        if (uploadError) {
          errorRedirect();
        }
        if (uploadData) {
          avatarUrl = uploadData.avatarUrl;
        }
      }

      // プロフィール情報の更新
      const { error: updateError } = await userProfilesAPI.updateProfile(
        params.id,
        {
          ...formData,
          avatarUrl,
        },
      );

      if (updateError) {
        errorRedirect();
      }

      // 成功時はクエリパラメータを付けてリダイレクト
      router.push(
        `${siteUrls.profile(params.id)}?t=${Date.now()}&success=true`,
      );
      router.refresh();
    } catch {
      errorRedirect();
    } finally {
      setSaving(false);
    }
  };

  if (loading)
    return (
      <main>
        <Header />
        <div className="container mx-auto px-4 py-8 flex justify-center items-center min-h-[60vh]">
          <Spinner />
        </div>
        <Footer />
      </main>
    );

  return (
    <main>
      <Header />
      <PageTitle title="プロフィール編集" />

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

          {/* 表示名 */}
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

          {/* SNSリンク */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-amber-800 border-b border-amber-200 pb-2 mb-4">
              SNSリンク
            </h3>

            {/* ウェブサイト */}
            <div className="flex items-center gap-3">
              <Globe size={24} className="text-amber-700 min-w-[24px]" />
              <div className="flex-1">
                <label className="block text-amber-800 font-medium mb-1">
                  ウェブサイト
                </label>
                <input
                  type="url"
                  name="websiteUrl"
                  value={formData.websiteUrl}
                  onChange={handleChange}
                  placeholder="https://example.com"
                  className="w-full px-4 py-2 border border-amber-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
            </div>

            {/* Twitter */}
            <div className="flex items-center gap-3">
              <Twitter size={24} className="text-amber-700 min-w-[24px]" />
              <div className="flex-1">
                <label className="block text-amber-800 font-medium mb-1">
                  Twitter
                </label>
                <input
                  type="url"
                  name="twitterUrl"
                  value={formData.twitterUrl}
                  onChange={handleChange}
                  placeholder="https://twitter.com/username"
                  className="w-full px-4 py-2 border border-amber-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
            </div>

            {/* Instagram */}
            <div className="flex items-center gap-3">
              <Instagram size={24} className="text-amber-700 min-w-[24px]" />
              <div className="flex-1">
                <label className="block text-amber-800 font-medium mb-1">
                  Instagram
                </label>
                <input
                  type="url"
                  name="instagramUrl"
                  value={formData.instagramUrl}
                  onChange={handleChange}
                  placeholder="https://instagram.com/username"
                  className="w-full px-4 py-2 border border-amber-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
            </div>

            {/* Facebook */}
            <div className="flex items-center gap-3">
              <Facebook size={24} className="text-amber-700 min-w-[24px]" />
              <div className="flex-1">
                <label className="block text-amber-800 font-medium mb-1">
                  Facebook
                </label>
                <input
                  type="url"
                  name="facebookUrl"
                  value={formData.facebookUrl}
                  onChange={handleChange}
                  placeholder="https://facebook.com/username"
                  className="w-full px-4 py-2 border border-amber-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
            </div>

            {/* LinkedIn */}
            <div className="flex items-center gap-3">
              <Linkedin size={24} className="text-amber-700 min-w-[24px]" />
              <div className="flex-1">
                <label className="block text-amber-800 font-medium mb-1">
                  LinkedIn
                </label>
                <input
                  type="url"
                  name="linkedinUrl"
                  value={formData.linkedinUrl}
                  onChange={handleChange}
                  placeholder="https://linkedin.com/in/username"
                  className="w-full px-4 py-2 border border-amber-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
            </div>

            {/* YouTube */}
            <div className="flex items-center gap-3">
              <Youtube size={24} className="text-amber-700 min-w-[24px]" />
              <div className="flex-1">
                <label className="block text-amber-800 font-medium mb-1">
                  YouTube
                </label>
                <input
                  type="url"
                  name="youtubeUrl"
                  value={formData.youtubeUrl}
                  onChange={handleChange}
                  placeholder="https://youtube.com/c/channelname"
                  className="w-full px-4 py-2 border border-amber-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
            </div>
          </div>

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
        </form>
      </div>

      <Footer />
    </main>
  );
}
