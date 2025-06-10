"use client";

import Image from "next/image";
import { Input } from "@/components/ui/input";
import { useNewBrand } from "@/hooks/useNewBrand";
import { Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

import Header from "@/components/ui/Header";
import Footer from "@/components/ui/Footer";
import PageTitle from "@/components/ui/PageTitle";
import { CheckPointType } from "@/lib/types";

type NewProps = {
  brandId: number;
  onSuccess: (newCheckPoint: CheckPointType) => void;
};

export const New = ({ brandId }: NewProps) => {
  const {
    name,
    setName,
    description,
    setDescription,
    previewUrl,
    fileInputRef,
    isSubmitting,
    uploadProgress,
    handleFileChange,
    handleRemoveFile,
    handleSubmit,
    handleCancel,
  } = useNewBrand();

  return (
    <main>
      <div>
        <Header />
        <PageTitle title="ブランドの追加" />
        <div className="form-container">
          <form onSubmit={(e) => handleSubmit(e, brandId)} className="form">
            <div className="grid gap-4 py-4">
              <div className="form-field">
                <label className="form-label">
                  ブランド名<span className="form-required">*</span>
                </label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="form-input"
                  placeholder="ブランド名"
                  required
                />
              </div>
              <div className="form-field">
                <label className="form-label">
                  画像 <span className="form-required">*</span>
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
              <div className="form-field">
                <label className="form-label">
                  説明 <span className="form-required">*</span>
                </label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="form-textarea"
                  rows={4}
                  placeholder="説明"
                  required
                />
              </div>
            </div>
            <div className="form-button-container">
              <Button
                type="button"
                variant="ghost"
                className="form-button-cancel"
                onClick={() => handleCancel()}
              >
                キャンセル
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="form-button-submit"
              >
                {isSubmitting ? (
                  <>
                    <span className="form-loading-spinner"></span>
                    送信中...
                  </>
                ) : (
                  "追加"
                )}
              </Button>
            </div>
          </form>
        </div>
        <Footer />
      </div>
    </main>
  );
};

export default New;
