"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import Image from "next/image";
import { Upload, X } from "lucide-react";
import { useCheckPointForm } from "../hooks/useCheckPointForm";
import { CheckPointType } from "@/lib/types";

interface AddCheckPointModalProps {
  isOpen: boolean;
  onClose: () => void;
  vintageId: number;
  onSuccess: (newCheckPoint: CheckPointType) => void;
}

const AddCheckPointModal = ({
  isOpen,
  onClose,
  vintageId,
  onSuccess,
}: AddCheckPointModalProps) => {
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
  } = useCheckPointForm();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] oldies-bg-primary oldies-border shadow-[0_4px_12px_rgba(122,95,67,0.15)]">
        <DialogHeader>
          <DialogTitle className="oldies-text-primary font-serif text-xl relative inline-block pb-2">
            Check point
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[var(--oldies-border-primary)]"></div>
          </DialogTitle>
          <DialogDescription className="oldies-text-secondary font-light italic">
            あなたの製品の特徴や見分け方のポイントを追加してください。
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={(e) => handleSubmit(e, vintageId, onSuccess, onClose)}>
          <div className="grid gap-4 py-4">
            <div className="items-center">
              <Input
                id="point"
                value={point}
                onChange={(e) => setPoint(e.target.value)}
                className="oldies-input"
                placeholder="ポイント"
                required
              />
            </div>
            <div className="items-start">
              <div className="col-span-3 space-y-3">
                {!previewUrl ? (
                  <div className="flex flex-col gap-2">
                    <div
                      className="oldies-border-dashed rounded-sm p-6 flex flex-col items-center justify-center cursor-pointer hover:oldies-bg-primary transition-colors oldies-bg-secondary"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <Upload className="h-8 w-8 oldies-text-secondary mb-2" />
                      <p className="text-sm font-serif oldies-text-primary">
                        クリックして画像をアップロード
                      </p>
                      <p className="text-xs oldies-text-secondary mt-1 italic">
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
                    <div className="relative aspect-video w-full overflow-hidden rounded-sm oldies-border oldies-bg-accent">
                      <Image
                        src={previewUrl}
                        alt="プレビュー"
                        fill
                        className="object-cover sepia-[0.15] brightness-[0.98]"
                        unoptimized
                      />
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      className="absolute -right-2 -top-2 h-6 w-6 rounded-full oldies-bg-primary oldies-border hover:oldies-bg-secondary"
                      onClick={handleRemoveFile}
                    >
                      <X className="h-4 w-4 oldies-text-accent" />
                      <span className="sr-only">削除</span>
                    </Button>
                    {isSubmitting && (
                      <div className="mt-2">
                        <div className="h-2 w-full oldies-bg-secondary rounded-full overflow-hidden">
                          <div
                            className="h-full bg-[var(--oldies-border-secondary)] transition-all duration-300 ease-in-out"
                            style={{ width: `${uploadProgress}%` }}
                          />
                        </div>
                        <p className="text-xs oldies-text-secondary mt-1 text-right italic">
                          {uploadProgress}%
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
            <div className="items-center">
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="oldies-textarea"
                rows={4}
                placeholder="説明"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="oldies-btn-outline font-serif"
            >
              キャンセル
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="oldies-btn-primary font-serif"
            >
              {isSubmitting ? "送信中..." : "追加"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddCheckPointModal;
