import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/components/Providers";
import { baseMetadata } from "@/lib/metadata";
import ToasterUI from "@/components/ui/ToasterUI";

export const metadata: Metadata = baseMetadata;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <ToasterUI />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
