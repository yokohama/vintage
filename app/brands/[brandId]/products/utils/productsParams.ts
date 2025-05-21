import { productsAPI } from "@/lib/api/supabase/productsAPI";
import { ProductType, ApiErrorType, BrandType } from "@/lib/types";

/**
 * ブランドIDパラメータから製品情報を取得する関数
 * @param params ルートパラメータ（brandIdを含むオブジェクト）
 * @returns 製品リスト、エラー情報、ブランド名を含むオブジェクト
 */
export async function productsParams(params: { brandId: string }): Promise<{
  brand: BrandType | null;
  products: ProductType[];
  error: string | null;
}> {
  const brandParams = await params;
  const brandId = parseInt(brandParams.brandId, 10);

  let products: ProductType[] = [];
  let error = null;
  let brand: BrandType | null = null;

  if (isNaN(brandId)) {
    return { products, error: "無効なブランドIDです", brand };
  }

  try {
    products = await productsAPI.getProductsByBrandId(brandId);
    if (products.length > 0) {
      brand = products[0].brand;
    }
  } catch (err) {
    const apiError = err as Error | ApiErrorType;
    error =
      "message" in apiError
        ? apiError.message
        : "製品の取得中にエラーが発生しました";
  }

  return { brand, products, error };
}
