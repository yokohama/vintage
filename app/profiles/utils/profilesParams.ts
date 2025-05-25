import { userProfilesAPI } from "@/lib/api/supabase/userProfilesAPI";
import { UserProfileType, ApiErrorType } from "@/lib/types";

/**
 * プロフィールIDパラメータからプロフィール情報を取得する関数
 * @param params ルートパラメータ（idを含むオブジェクト）
 * @returns プロフィール、エラー情報を含むオブジェクト
 */
export async function profilesParams(params: { id: string }): Promise<{
  profile: UserProfileType | null;
  error: string | null;
}> {
  const profileId = params.id;

  let profile: UserProfileType | null = null;
  let error = null;

  if (!profileId) {
    return { profile, error: "無効なプロフィールIDです" };
  }

  try {
    profile = await userProfilesAPI.getUserProfile(profileId);
  } catch (err) {
    const apiError = err as Error | ApiErrorType;
    error =
      "message" in apiError
        ? apiError.message
        : "プロフィールの取得中にエラーが発生しました";
  }

  return { profile, error };
}
