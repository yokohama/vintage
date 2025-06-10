"use client";

import Image from "next/image";
import { Input } from "@/components/ui/input";
import { useNewCheckPoint } from "@/hooks/useNewCheckPoint";
import { Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

import Header from "@/components/ui/Header";
import Footer from "@/components/ui/Footer";
import PageTitle from "@/components/ui/PageTitle";
import { CheckPointType } from "@/lib/types";

type NewProps = {
  vintageId: number;
  onSuccess: (newCheckPoint: CheckPointType) => void;
};

export const New = ({ vintageId }: NewProps) => {
  const {
    point,
    setPoint,
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
  } = useNewCheckPoint();

  return (
    <main>
      <div>
        <Header />
        <PageTitle title="観点ポイントの追加" />
        <div className="form-container">
          <form onSubmit={(e) => handleSubmit(e, vintageId)}>
            <div className="grid gap-4 py-4">
              <div className="items-center">
                <label className="block text-amber-800 font-medium mb-2">
                  ポイント <span className="text-red-500">*</span>
                </label>
                <Input
                  id="point"
                  value={point}
                  onChange={(e) => setPoint(e.target.value)}
                  className="w-full px-4 py-2 border border-amber-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                  placeholder="ポイント"
                  required
                />
              </div>
              <div className="items-start">
                <label className="block text-amber-800 font-medium mb-2">
                  画像 <span className="text-red-500">*</span>
                </label>
                <div className="col-span-3 space-y-3">
                  {!previewUrl ? (
                    <div className="flex flex-col gap-2">
                      <div
                        className="border border-amber-300 border-dashed rounded-md p-6 flex flex-col items-center justify-center cursor-pointer hover:bg-amber-100 transition-colors bg-white"
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
                      <div
                        className="relative aspect-video w-full overflow-hidden rounded-md border border-amber-300 bg-white"
                        style={{ position: "relative" }}
                      >
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
              <div className="items-center">
                <label className="block text-amber-800 font-medium mb-2">
                  説明 <span className="text-red-500">*</span>
                </label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-4 py-2 border border-amber-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                  rows={4}
                  placeholder="説明"
                  required
                />
              </div>
            </div>
            <div>
              <Button
                type="button"
                variant="ghost"
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-2 rounded-md shadow-sm border-0 w-full sm:w-auto"
                onClick={() => handleCancel()}
              >
                キャンセル
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-amber-600 hover:bg-amber-700 text-white px-6 py-2 rounded-md shadow-sm w-full sm:w-auto"
              >
                {isSubmitting ? "送信中..." : "追加"}
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
