import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { cookies } from "next/headers";
import HundleFullPage from "@/helper/get-page-url";
import PwaInstallButton from "@/components/pwa/pwa-install-button";
import { S2SProvider } from "@repo/providers";
import { 
  LocalizationProvider,
  GLOBAL_DICTIONARIES,
  LOCALE_COOKIE_NAME,
  safeLocale 
} from "@repo/localization";

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
  const cookieStore = cookies();
  const cookieLocale = cookieStore.get(LOCALE_COOKIE_NAME)?.value ?? "";
  const initialLocale = safeLocale(cookieLocale);

  return (
    <html lang="ar">
      <head>
        <link
          href="https://cdn.syncfusion.com/ej2/26.1.35/material.css"
          rel="stylesheet"
        />
        {/* PWA */}
        <link rel="manifest" href="/site.webmanifest" />
        <meta name="theme-color" content="#F27A00" />
        <meta
          name="apple-mobile-web-app-capable"
          content="yes"
        />
        <meta
          name="apple-mobile-web-app-status-bar-style"
          content="default"
        />
        <meta name="apple-mobile-web-app-title" content="S2S Panel" />
        <link rel="icon" href="/fav/favicon-16x16.png" sizes="16x16" type="image/png" />
        <link rel="icon" href="/fav/favicon-32x32.png" sizes="32x32" type="image/png" />
        <link rel="icon" href="/fav/favicon-96x96.png" sizes="96x96" type="image/png" />
        <link rel="apple-touch-icon" href="/fav/apple-icon.png" sizes="180x180" />
        <link rel="apple-touch-icon" href="/fav/apple-icon-57x57.png" sizes="57x57" />
        <link rel="apple-touch-icon" href="/fav/apple-icon-60x60.png" sizes="60x60" />
        <link rel="apple-touch-icon" href="/fav/apple-icon-72x72.png" sizes="72x72" />
        <link rel="apple-touch-icon" href="/fav/apple-icon-76x76.png" sizes="76x76" />
        <link rel="apple-touch-icon" href="/fav/apple-icon-114x114.png" sizes="114x114" />
        <link rel="apple-touch-icon" href="/fav/apple-icon-120x120.png" sizes="120x120" />
        <link rel="apple-touch-icon" href="/fav/apple-icon-144x144.png" sizes="144x144" />
        <link rel="apple-touch-icon" href="/fav/apple-icon-152x152.png" sizes="152x152" />
        <link rel="apple-touch-icon" href="/fav/apple-icon-180x180.png" sizes="180x180" />
        <meta name="msapplication-TileColor" content="#F27A00" />
        <meta name="msapplication-config" content="/fav/browserconfig.xml" />
      </head>
      <body className={inter.className}>
        <LocalizationProvider
          initialLocale={initialLocale}
          dictionaries={GLOBAL_DICTIONARIES}
        >
          <S2SProvider includeQuery={true}>
            {children}
            <HundleFullPage />
            <PwaInstallButton />
          </S2SProvider>
        </LocalizationProvider>
      </body>
    </html>
  );
}
