import type { Metadata } from "next";
import { baseMetadata, generateProductsMetadata } from "@/lib/metadata";
import { productsParams } from "./utils/productsParams";

export async function generateMetadata({
  params,
}: {
  params: { brandId: string };
}): Promise<Metadata> {
  const { brand, products, error } = await productsParams(params);

  if (!brand || products.length === 0 || error) {
    return baseMetadata;
  }

  return generateProductsMetadata(brand);
}

export default function ProductsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}
