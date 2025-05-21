import { productsAPI } from "@/lib/api/supabase/productsAPI";
import { ProductType, ApiErrorType } from "@/lib/types";

/**
 * ブランドIDパラメータから製品情報を取得する関数
 * @param params ルートパラメータ（productIdを含むオブジェクト）
 * @returns 製品、エラー
 */
export async function productParams(params: { productId: string }): Promise<{
  product: ProductType | null;
  error: string | null;
}> {
  const productId = parseInt(params.productId, 10);

  let product: ProductType | null = null;
  let error = null;

  if (!productId) {
    return { product, error: "無効なプロダクトIDです" };
  }

  try {
    product = await productsAPI.getProduct(productId);
  } catch (err) {
    const apiError = err as Error | ApiErrorType;
    error =
      "message" in apiError
        ? apiError.message
        : "プロダクトの取得中にエラーが発生しました";
  }

  return { product, error };
}
