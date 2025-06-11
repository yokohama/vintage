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

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

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
        <div className="form-container">
          <form onSubmit={handleSubmit} className="form">
            {/* プロフィール画像 */}
            <div className="form-profile-image-container">
              <div className="form-profile-image">
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

              <label className="form-profile-image-upload-button">
                画像を変更
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
            </div>

            <Input
              label="表示名"
              name="displayName"
              value={formData.displayName}
              handleChange={handleChange}
            />

            <Textarea
              label="プロフィール"
              name="description"
              value={formData.description}
              handleChange={handleChange}
            />

            <div className="space-y-4">
              <h3 className="form-sns-section-title">SNSリンク</h3>

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
              <div className="form-button-container">
                <button
                  type="button"
                  onClick={() => router.back()}
                  className="form-button-cancel"
                >
                  キャンセル
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="form-button-submit"
                >
                  {saving ? (
                    <>
                      <span className="form-loading-spinner"></span>
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
