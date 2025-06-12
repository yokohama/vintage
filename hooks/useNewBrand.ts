import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { BrandType } from "@/lib/types";
import { brandsAPI } from "@/lib/api/supabase/brandsAPI";
import { userProfilesAPI } from "@/lib/api/supabase/userProfilesAPI";
import { storageAPI } from "@/lib/api/supabase/storageAPI";
import { useNew } from "./useNew";

interface UseNewBrandReturn {
  name: string;
  setName: (value: string) => void;
  description: string;
  setDescription: (value: string) => void;
  selectedFile: File | null;
  previewUrl: string | null;
  fileInputRef: React.RefObject<HTMLInputElement>;
  isSubmitting: boolean;
  uploadProgress: number;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleRemoveFile: () => void;
  handleSubmit: (e: React.FormEvent, productVintateId: number) => Promise<void>;
  handleCancel: () => void;
}

export function useNewBrand(): UseNewBrandReturn {
  const router = useRouter();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const {
    selectedFile,
    previewUrl,
    fileInputRef,
    handleFileChange,
    handleRemoveFile,
    handleCancel,
    setSelectedFile,
    setPreviewUrl,
    isSubmitting,
    setIsSubmitting,
    uploadProgress,
    setUploadProgress,
  } = useNew();

  const handleAdd = async (
    name: string,
    file: File,
    description: string | null,
  ): Promise<{ success: boolean; brand?: BrandType }> => {
    setIsSubmitting(true);
    setUploadProgress(0);

    try {
      // ログインユーザーの取得
      const userProfile = await userProfilesAPI.getCurrentUserProfile();

      setUploadProgress(10);

      // 画像をアップロードしてURLを取得
      const { publicUrl } = await storageAPI.uploadImage({
        file,
        userId: userProfile.id,
        folderName: "avatar",
      });

      setUploadProgress(70);

      // ブランドの追加
      const newBrand = await brandsAPI.addBrand(
        name,
        publicUrl,
        description,
        userProfile.id,
      );

      setUploadProgress(100);

      toast.success("ブランドを追加しました");
      return { success: true, brand: newBrand };
    } catch {
      toast.error("ブランドの追加でエラーが発生しました。");
      return { success: false };
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error("ブランドを入力してください");
      return;
    }

    if (!description.trim()) {
      toast.error("説明を入力してください");
      return;
    }

    if (!selectedFile) {
      toast.error("画像をアップロードしてください");
      return;
    }

    const result = await handleAdd(name, selectedFile, description || null);

    if (result.success && result.brand) {
      setName("");
      setDescription("");
      setSelectedFile(null);
      setPreviewUrl(null);
      router.back();
    }
  };

  return {
    name,
    setName,
    description,
    setDescription,
    selectedFile,
    previewUrl,
    fileInputRef,
    isSubmitting,
    uploadProgress,
    handleFileChange,
    handleRemoveFile,
    handleSubmit,
    handleCancel,
  };
}
