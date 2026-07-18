"use server";

import { SiteId, SiteSlug } from "@/abstracts/siteSlug";
import { cookies } from "next/headers";

export async function deleteSession() {
    if(cookies().has("session")){
        cookies().delete(SiteSlug);
        cookies().delete(SiteId);
        return cookies().delete("session");
    }

    return null;
}