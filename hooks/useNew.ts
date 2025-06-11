import React, { useState, useRef, SetStateAction } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface UseNewReturn {
  selectedFile: File | null;
  previewUrl: string | null;
  fileInputRef: React.RefObject<HTMLInputElement>;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleRemoveFile: () => void;
  handleCancel: () => void;
  setSelectedFile: React.Dispatch<SetStateAction<File | null>>;
  setPreviewUrl: React.Dispatch<SetStateAction<string | null>>;
  isSubmitting: boolean;
  setIsSubmitting: React.Dispatch<SetStateAction<boolean>>;
  uploadProgress: number;
  setUploadProgress: React.Dispatch<SetStateAction<number>>;
}

type useNewProps = {
  cancelMsg?: string;
};

export function useNew(props?: useNewProps): UseNewReturn {
  const cancelMsg = props?.cancelMsg ?? "キャンセルしました。";

  const router = useRouter();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const handleCancel = () => {
    toast.success(cancelMsg);
    router.back();
  };

  return {
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
  };
}
