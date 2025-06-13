import { brandsAPI } from "@/lib/api/supabase/brandsAPI";
import Brands from "./brands/components/Brands";

export const revalidate = 0;

export default async function Home() {
  const initialBrands = await brandsAPI.getBrands(1, 10);

  return <Brands initialBrands={initialBrands} />;
}
