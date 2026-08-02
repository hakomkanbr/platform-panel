import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { cookies } from "next/headers";
import HundleFullPage from "@/helper/get-page-url";
import { S2SProvider } from "@repo/providers";
// Subpath imports keep client-only context modules out of the Server Component.
import { LocalizationProvider } from "@repo/localization/provider/LocalizationProvider";
import { GLOBAL_DICTIONARIES } from "@repo/localization/dictionary/globalDictionary";
import { LOCALE_COOKIE_NAME } from "@repo/localization/constants/languages";
import { safeLocale } from "@repo/localization/server/locale";

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
    <html lang="en">
      <head>
        <link
          href="https://cdn.syncfusion.com/ej2/26.1.35/material.css"
          rel="stylesheet"
        />
      </head>
      <body className={inter.className}>
        <LocalizationProvider
          initialLocale={initialLocale}
          dictionaries={GLOBAL_DICTIONARIES}
        >
          <S2SProvider includeQuery={true}>
            {children}
            <HundleFullPage />
          </S2SProvider>
        </LocalizationProvider>
      </body>
    </html>
  );
}