import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.scss";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import { StoreProvider } from "@repo/store";
import { ConfigProvider } from "antd";
import HundleFullPage from "@/helper/get-page-url";
import { AuthProvider } from "@repo/auth";
import { globalStyles, modernTheme } from "@repo/theme";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Share2Sells Platform",
  description: "Enterprise SaaS Platform by Bremix Tech",
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
        <style dangerouslySetInnerHTML={{ __html: globalStyles }} />
      </head>
      <body className={inter.className}>
        <StoreProvider>
          <AuthProvider>
            <ConfigProvider theme={modernTheme}>
              <AntdRegistry>
                {children}
                <HundleFullPage />
              </AntdRegistry>
            </ConfigProvider>
          </AuthProvider>
        </StoreProvider>
      </body>
    </html>
  );
}
