import type { Metadata } from "next";
import { getTokenPayload } from "@repo/utils";
import { cookies } from "next/headers";
import FullScreenLoader from "@/components/elements/full-screnn-loader/full-screnn-loader";
import HundleLanguage from "@/components/elements/hundle-language";
import { getSidebarItems } from "@/utils/sidebarItems";
import { AuthInitGate } from "@/components/auth/AuthInitGate";
import CmsLayoutClient from "./CmsLayoutClient";


export const metadata: Metadata = {
  title: "Share2Sells Platform - CMS",
  description: "Content Management System",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = cookies();
  const token = cookieStore.get("access_token")?.value;
  const currentProjectId = cookieStore.get("ProjectId")?.value;
  const currentProjectName = cookieStore.get("ProjectName")?.value;
  const user: any = token ? await getTokenPayload(token) : null;

  return (
    <CmsLayoutClient
      currentProject={currentProjectId ? { id: currentProjectId, name: currentProjectName ?? "" } : null}
      sidebarItems={getSidebarItems(user?.role)}
      user={user || {}}
    >
      <AuthInitGate>
        <FullScreenLoader />
        <HundleLanguage data={[]} />
        {children}
      </AuthInitGate>
    </CmsLayoutClient>
  );
}
