import Image from "next/image";
import { Upload, X, SquarePen } from "lucide-react";

import { siteConfig } from "@/lib/config/siteConfig";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type FileUploadProps = {
  label?: string;
  required?: boolean;
  previewUrl?: string;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleRemoveFile: () => void;
  fileInputRef: React.RefObject<HTMLInputElement>;
  isSubmitting: boolean;
  uploadProgress: number;
};

export const FileUpload = ({
  label,
  required,
  previewUrl,
  handleFileChange,
  handleRemoveFile,
  fileInputRef,
  isSubmitting,
  uploadProgress,
}: FileUploadProps) => {
  return (
    <div className="form-field">
      <label className="form-label">
        {label} {required && <span className="form-required">*</span>}
      </label>
      <div className="col-span-3 space-y-3">
        {!previewUrl ? (
          <div className="flex flex-col gap-2">
            <div
              className="form-image-upload"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="h-8 w-8 text-amber-700 mb-2" />
              <p className="text-sm font-serif text-amber-800">
                クリックして画像をアップロード
              </p>
              <p className="text-xs text-amber-600 mt-1 italic">
                JPG, PNG, GIF (最大5MB)
              </p>
            </div>
            <Input
              ref={fileInputRef}
              id="imageUpload"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>
        ) : (
          <div className="relative">
            <div className="form-image-preview">
              <Image
                src={previewUrl}
                alt="プレビュー"
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
                className="object-cover"
                unoptimized
              />
            </div>
            <Button
              type="button"
              variant="outline"
              size="icon"
              className="absolute -right-2 -top-2 h-6 w-6 rounded-full bg-white border border-amber-300 hover:bg-amber-100"
              onClick={handleRemoveFile}
            >
              <X className="h-4 w-4 text-amber-700" />
              <span className="sr-only">削除</span>
            </Button>
            {isSubmitting && (
              <div className="mt-2">
                <div className="h-2 w-full bg-amber-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-amber-600 transition-all duration-300 ease-in-out"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
                <p className="text-xs text-amber-600 mt-1 text-right italic">
                  {uploadProgress}%
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

type profileImageUploadProps = {
  previewImage: string | null;
  handleImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export const ProfileImageUpload = ({
  previewImage,
  handleImageChange,
}: profileImageUploadProps) => {
  return (
    <>
      <div className="flex justify-center mb-6">
        <div className="relative w-35 h-35">
          <div className="absolute inset-0 rounded-full overflow-hidden ring-4 ring-yellow-300">
            <Image
              src={previewImage || siteConfig.images.defaultProfileAvatar}
              alt="プロフィール画像"
              fill
              className="object-cover"
              unoptimized={
                (previewImage && previewImage.includes("api.dicebear.com")) ||
                false
              }
            />
          </div>

          <label
            className="
        absolute top-1/2 left-1/2 
        transform -translate-x-1/2 -translate-y-1/2
        p-2 rounded-full 
        bg-black/50 bg-opacity-50 
        cursor-pointer
      "
          >
            <SquarePen className="h-5 w-5 text-white" />
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
          </label>
        </div>
      </div>
    </>
  );
};
