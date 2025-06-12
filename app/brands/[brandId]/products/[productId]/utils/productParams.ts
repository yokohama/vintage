import { productsAPI } from "@/lib/api/supabase/productsAPI";
import { ProductType } from "@/lib/types";
import { throwError } from "@/lib/error";

export async function productParams(params: {
  productId: string;
}): Promise<ProductType> {
  const productId = parseInt(params.productId, 10);

  if (!productId || isNaN(productId)) {
    throwError("無効なプロダクトIDです");
  }

  // throwNotFoundをtrueに設定して、データがない場合は404エラーを返す
  return await productsAPI.getSimpleProduct(productId, true);
}
