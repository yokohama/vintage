import { brandsAPI } from "@/lib/api/supabase/brandsAPI";
import { ApiErrorType, BrandType } from "@/lib/types";
import Brands from "./components/Brands";

export default async function BrandsPage() {
  let brands: BrandType[] = [];
  let error = null;

  try {
    brands = await brandsAPI.getBrands();
  } catch (err) {
    error = err;
  }

  return <Brands brands={brands} error={error as ApiErrorType} />;
}
