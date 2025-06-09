import { brandsAPI } from "@/lib/api/supabase/brandsAPI";
import { ApiErrorType, BrandType } from "@/lib/types";
import Brands from "./components/Brands";

export default async function BrandsPage() {
  let initialBrands: BrandType[] = [];
  let initialError = null;

  try {
    initialBrands = await brandsAPI.getBrands(1, 10);
  } catch (err) {
    initialError = err;
  }

  return (
    <Brands
      initialBrands={initialBrands}
      initialError={initialError as ApiErrorType}
    />
  );
}
