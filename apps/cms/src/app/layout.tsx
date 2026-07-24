import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.scss";
import HundleFullPage from "@/helper/get-page-url";
import { S2SProvider } from "@repo/providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Share2Sells Platform - CMS",
  description: "Content Management System by Bremix Tech",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://cdn.syncfusion.com/ej2/26.1.35/material.css"
          rel="stylesheet"
        />
      </head>
      <body className={inter.className}>
        <S2SProvider>
          {children}
          <HundleFullPage />
        </S2SProvider>
      </body>
    </html>
  );
}
