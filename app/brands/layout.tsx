import type { Metadata } from "next";
import "@/app/globals.css";
import { generateBrandsMetadata } from "@/lib/metadata";

export async function generateMetadata(): Promise<Metadata> {
  return generateBrandsMetadata();
}

export default function BrandsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}
