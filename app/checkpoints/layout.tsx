import type { Metadata } from "next";
import "@/app/globals.css";
import { generateCheckpointsMetadata } from "@/lib/metadata";

export async function generateMetadata(): Promise<Metadata> {
  return generateCheckpointsMetadata();
}

export default function CheckPointsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}
