import { brandsAPI } from "@/lib/api/supabase/brandsAPI";
import Brands from "./components/Brands";
import { throwError } from "@/lib/error";

export default async function BrandsPage() {
  try {
    // throwNotFoundをtrueに設定して、データがない場合は404エラーを返す
    const initialBrands = await brandsAPI.getBrands(1, 10, true);

    return <Brands initialBrands={initialBrands} initialError={null} />;
  } catch (err) {
    throwError(err, "ブランド一覧の取得中にエラーが発生しました");
  }
}
