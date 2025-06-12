import { notFound } from "next/navigation";
import { productsAPI } from "@/lib/api/supabase/productsAPI";
import { ProductType, BrandType } from "@/lib/types";

/**
 * ブランドIDパラメータから製品情報を取得する関数
 * @param params ルートパラメータ（brandIdを含むオブジェクト）
 * @returns 製品リスト、ブランド情報
 */
export async function productsParams(params: { brandId: string }): Promise<{
  brand: BrandType | null;
  products: ProductType[];
}> {
  const brandParams = await params;
  const brandId = parseInt(brandParams.brandId, 10);

  // 無効なブランドIDの場合は即座にnotFound()を返す
  if (isNaN(brandId)) {
    notFound();
  }

  // APIからデータを取得
  const products = await productsAPI.getProductsByBrandId(brandId);

  // 製品が見つからない場合はnotFound()を呼び出す
  if (products.length === 0) {
    notFound();
  }

  // ブランド情報を取得
  const brand = products[0].brand;

  return { brand, products };
}
