import type { Metadata } from "next";
import { baseMetadata, generateProfileMetadata } from "@/lib/metadata";
import { profilesParams } from "../utils/profilesParams";

export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  const { profile, error } = await profilesParams(params);

  if (!profile || error) {
    return baseMetadata;
  }

  return generateProfileMetadata(profile);
}

export default function ProductLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
