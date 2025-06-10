import React, { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { CheckPointType } from "@/lib/types";
import { checkPointsAPI } from "@/lib/api/supabase/checkPointsAPI";
import { userProfilesAPI } from "@/lib/api/supabase/userProfilesAPI";

interface UseNewCheckPointReturn {
  point: string;
  setPoint: (value: string) => void;
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

export function useNewCheckPoint(): UseNewCheckPointReturn {
  const router = useRouter();

  const [point, setPoint] = useState("");
  const [description, setDescription] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleAdd = async (
    productVintageId: number,
    point: string,
    file: File,
    description: string | null,
  ): Promise<{ success: boolean; checkPoint?: CheckPointType }> => {
    setIsSubmitting(true);
    setUploadProgress(0);

    try {
      // ログインユーザーの取得
      const userProfile = await userProfilesAPI.getCurrentUserProfile();

      // アップロード開始時に進捗を設定
      setUploadProgress(10);

      // 画像をアップロードしてURLを取得
      const imageUrl = await checkPointsAPI.uploadImage(file, userProfile.id);

      // アップロード完了時に進捗を更新
      setUploadProgress(70);

      // 鑑定ポイントの追加
      const newCheckPoint = await checkPointsAPI.addCheckPoint(
        productVintageId,
        point,
        imageUrl,
        description,
        userProfile.id,
      );

      setUploadProgress(100);
      toast.success("鑑定ポイントを追加しました");
      return { success: true, checkPoint: newCheckPoint };
    } catch {
      // エラーメッセージを明示的に表示
      toast.error("鑑定ポイントの追加でエラーが発生しました。");
      return { success: false };
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // ファイルサイズチェック (5MB以下)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("ファイルサイズは5MB以下にしてください");
      return;
    }

    // 画像ファイルのみ許可
    if (!file.type.startsWith("image/")) {
      toast.error("画像ファイルのみアップロードできます");
      return;
    }

    setSelectedFile(file);

    // プレビュー用のURL生成
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e: React.FormEvent, productVintageId: number) => {
    e.preventDefault();

    if (!point.trim()) {
      toast.error("鑑定ポイントを入力してください");
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

    const result = await handleAdd(
      productVintageId,
      point,
      selectedFile,
      description || null,
    );

    if (result.success && result.checkPoint) {
      setPoint("");
      setDescription("");
      setSelectedFile(null);
      setPreviewUrl(null);
      router.back();
    }
  };

  const handleCancel = () => {
    toast.success("キャンセルしました。");
    router.back();
  };

  return {
    point,
    setPoint,
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
