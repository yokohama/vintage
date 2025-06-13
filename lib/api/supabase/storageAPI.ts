import { supabase } from "@/lib/supabase";
import { throwError } from "@/lib/error";

type UploadImageProps = {
  file: File;
  userId: string;
  folderName: string;
};

type UploadImageReturnProps = {
  publicUrl: string;
};

/*
 * checkPointの画像アップロード
 */
export class storageAPI {
  static uploadImage = async ({
    file,
    userId,
    folderName,
  }: UploadImageProps): Promise<UploadImageReturnProps> => {
    // ファイル名の一意性を確保するためにタイムスタンプとランダム文字列を追加
    const fileExt = file.name.split(".").pop();
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 15);
    const fileName = `${userId}_${timestamp}_${randomString}.${fileExt}`;
    const filePath = `${folderName}/${fileName}`;

    // Supabaseに画像をアップロード
    const { error } = await supabase.storage
      .from("images")
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (error) {
      throwError(error, "画像のアップロードに失敗しました");
    }

    // 公開URLを取得
    const {
      data: { publicUrl },
    } = supabase.storage.from("images").getPublicUrl(filePath);

    return { publicUrl };
  };

  UploadAvatar = async (id: string, file: File) => {
    try {
      // ファイル名を生成（ユニークにするためにタイムスタンプを追加）
      const fileExt = file.name.split(".").pop();
      const fileName = `${id}-${Date.now()}.${fileExt}`;
      const filePath = `avatars/${fileName}`;

      // Storageにアップロード
      const { error: uploadError } = await supabase.storage
        .from("images")
        .upload(filePath, file);

      if (uploadError) {
        console.log(uploadError);
        return { data: null, error: uploadError };
      }

      // 公開URLを取得
      const {
        data: { publicUrl },
      } = supabase.storage.from("images").getPublicUrl(filePath);

      // プロフィールのavatar_urlを更新
      const { error: updateError } = await supabase
        .from("profiles")
        .update({ avatar_url: publicUrl })
        .eq("id", id);

      if (updateError) {
        return { data: null, error: updateError };
      }

      return {
        data: { avatarUrl: publicUrl },
        error: null,
      };
    } catch (error) {
      console.error("アバターアップロードエラー:", error);
      return {
        data: null,
        error: { message: "プロフィール画像のアップロードに失敗しました" },
      };
    }
  };
}
