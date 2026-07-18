import axios, { AxiosError } from "axios";
import { redirect } from "next/navigation";
import route_paths from "@/helper/route_paths";
import { getCookie, getcookies } from "@/app/actions/set-cookie";
import { SiteId, SiteSlug } from "@/abstracts/siteSlug";

const api_server = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

api_server.interceptors.request.use(async (req: any) => {

  const cookieHeader = (await getcookies())
    .map((c) => `${c.name}=${c.value}`)
    .join("; ");

  // إضافة بيانات الموقع في body إذا كان post
  if (req.method?.toLowerCase() === "post") {
    req.data = {
      ...(req.data || {}),
      site: await getCookie(SiteSlug),
      siteId: await getCookie(SiteId),
    };
  }

  // إضافة الكوكيز و domain إلى الهيدر بشكل متوافق مع AxiosHeaders أو object
  if (req.headers) {
    const headers = req.headers as any;

    headers["Cookie"] = cookieHeader;

    if (process.env.NODE_ENV === "development") {
      headers["Domain"] = "hakim";
    }
  }

  return req;
});

api_server.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      redirect(route_paths.auth.login);
    }
    if (error.response?.data) {
      throw new Error(JSON.stringify(error.response.data)).message;
    }
    throw new Error(JSON.stringify({})).message;
  }
);

export default api_server;
