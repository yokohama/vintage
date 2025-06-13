import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { siteConfig, siteUrls } from "@/lib/config/siteConfig";
import { userProfilesAPI } from "@/lib/api/supabase/userProfilesAPI";
import { storageAPI } from "@/lib/api/supabase/storageAPI";
import { UserProfileType } from "@/lib/types";

type useEditProps = {
  profileId: string;
};

export const useEdit = ({ profileId }: useEditProps) => {
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfileType | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);

  // フォームの状態
  const [formData, setFormData] = useState({
    displayName: "",
    description: "",
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
        const data = await userProfilesAPI.getUserProfile(profileId);
        if (data) {
          setProfile(data);
          setFormData({
            displayName: data.displayName || "",
            description: data.description || "",
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
        router.push(`/profiles/${profileId}?t=${Date.now()}&error=true`);
        router.refresh();
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [profileId, router]);

  // 入力フィールドの変更ハンドラ
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const errorRedirect = () => {
    router.push(`${siteUrls.profile(profileId)}?t=${Date.now()}&error=true`);
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

    let avatarUrl = profile?.avatarUrl || "";

    try {
      if (imageFile) {
        const { publicUrl } = await storageAPI.uploadImage({
          file: imageFile,
          userId: profileId,
          folderName: "avatar",
        });

        avatarUrl = publicUrl;
      }
    } catch (err) {
      console.error(err);
      errorRedirect();
    } finally {
      setSaving(false);
    }

    // プロフィール情報の更新
    await userProfilesAPI.updateProfile(profileId, {
      ...formData,
      avatarUrl,
    });

    // 成功時はクエリパラメータを付けてリダイレクト
    router.push(`${siteUrls.profile(profileId)}?t=${Date.now()}&success=true`);
    router.refresh();
  };

  return {
    loading,
    saving,
    previewImage,
    handleChange,
    handleImageChange,
    handleSubmit,
    formData,
    router,
  };
};
