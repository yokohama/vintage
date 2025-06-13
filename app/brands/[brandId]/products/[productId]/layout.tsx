import type { Metadata } from "next";
import { baseMetadata, generateProductMetadata } from "@/lib/metadata";
import { productParams } from "./utils/productParams";

export async function generateMetadata({
  params,
}: {
  params: { productId: string };
}): Promise<Metadata> {
  const product = await productParams(params);

  if (!product) {
    return baseMetadata;
  }

  return generateProductMetadata(product);
}

export default function ProductLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
