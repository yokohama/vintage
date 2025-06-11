"use client";

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
import { ProfileImageUpload } from "@/components/ui/fileUpload";

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
            <ProfileImageUpload
              previewImage={previewImage}
              handleImageChange={handleImageChange}
            />

            <Input
              label="表示名"
              name="displayName"
              value={formData.displayName}
              onChange={handleChange}
              required
            />

            <Textarea
              label="プロフィール"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
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
