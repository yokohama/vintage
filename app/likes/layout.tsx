import type { Metadata } from "next";
import "@/app/globals.css";
import { generateLikesMetadata } from "@/lib/metadata";

export async function generateMetadata(): Promise<Metadata> {
  return generateLikesMetadata();
}

export default function LikesLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}
