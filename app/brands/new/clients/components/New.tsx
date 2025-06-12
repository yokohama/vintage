"use client";

import { Input } from "@/components/ui/input";
import { useNewBrand } from "@/hooks/useNewBrand";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { FileUpload } from "@/components/ui/fileUpload";

import Header from "@/components/ui/Header";
import Footer from "@/components/ui/Footer";
import PageTitle from "@/components/ui/PageTitle";

type NewProps = {
  brandId: number;
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
              <Input
                id="name"
                label="ブランド名"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="form-input"
                placeholder="ブランド名"
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
