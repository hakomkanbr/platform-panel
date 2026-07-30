import type { Metadata } from "next";
import { getTokenPayload } from "@repo/utils";
import { cookies } from "next/headers";
import FullScreenLoader from "@/components/elements/full-screnn-loader/full-screnn-loader";
import HundleLanguage from "@/components/elements/hundle-language";
import { getSidebarItems } from "@repo/utils";
import AdminLayoutClient from "./AdminLayoutClient";

export const metadata: Metadata = {
  title: "Share2Sells Platform",
  description: "Enterprise SaaS Platform",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = cookies();
  const token = cookieStore.get("AuthToken")?.value;
  const user: any = await getTokenPayload(token ?? "");

  return (
    <AdminLayoutClient user={user}>
      <FullScreenLoader />
      <HundleLanguage data={[]} />
      {children}
    </AdminLayoutClient>
  );
}
