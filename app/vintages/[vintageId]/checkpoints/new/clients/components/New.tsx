"use client";

import Header from "@/components/ui/Header";
import Footer from "@/components/ui/Footer";
import PageTitle from "@/components/ui/PageTitle";
import { CheckPointType } from "@/lib/types";

import { useNewCheckPoint } from "@/hooks/useNewCheckPoint";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { FileUpload } from "@/components/ui/fileUpload";

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
          <form onSubmit={(e) => handleSubmit(e, vintageId)} className="form">
            <div className="grid gap-4 py-4">
              <Input
                label="ポイント"
                name="point"
                value={point}
                onChange={(e) => setPoint(e.target.value)}
                placeholder="タグ"
                required
              />
              <FileUpload
                label="画像"
                previewUrl={previewUrl || ""}
                handleFileChange={handleFileChange}
                handleRemoveFile={handleRemoveFile}
                fileInputRef={fileInputRef}
                isSubmitting={isSubmitting}
                uploadProgress={uploadProgress}
                required
              />
              <Textarea
                label="説明"
                name="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
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
