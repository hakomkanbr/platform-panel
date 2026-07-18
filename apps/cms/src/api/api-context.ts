import { SiteId, SiteSlug } from "@/abstracts/siteSlug";
import { deleteCookie, getCookie, getcookies } from "@/app/actions/set-cookie";
import route_paths from "@/helper/route_paths";
import axios, { AxiosError } from "axios";
import { redirect } from "next/navigation";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true
});

api.interceptors.request.use(async (req) => {
  const cookieHeader = (await getcookies())
    .map((c) => `${c.name}=${c.value}`)
    .join("; ");

  const isFormData = typeof FormData !== "undefined" && req.data instanceof FormData;
  
  let site = await getCookie(SiteSlug);
  let siteId = await getCookie(SiteId);
  // إضافة بيانات الموقع في body إذا لم يكن formData و إذا كان post
  if (req.method?.toLowerCase() === "post" && !isFormData) {
    req.data = {
      ...(req.data || {}),
      site: site,
      siteId: siteId,
    };
  } else if (isFormData) {
    // إضافة القيم الخاصة بالموقع داخل الـ FormData
    req.data.append("site", site);
    req.data.append("siteId", siteId);
  }

  // إضافة الكوكيز و domain إلى الهيدر بشكل متوافق مع AxiosHeaders أو object
  if (req.headers) {
    const headers = req.headers as any;
    headers["Cookie"] = cookieHeader;
    req.headers.site = site;
    req.headers.siteId = siteId;
  }

  req.headers.Domain = await getCookie("Host");
  if (process.env.NODE_ENV == "development") req.headers.Domain = "hakim";

  return req;
});

api.interceptors.response.use(
  (config: any) => {
    return config;
  },
  (error: AxiosError<any>) => {
    if (error.response?.status === 401) {
      console.info("error.response => " ,error.response);
      deleteCookie("AuthLogin");
      if (typeof window !== "undefined") {
        // إعادة التوجيه في client-side فقط
        window.location.href = route_paths.auth.login;
      }else{
        redirect(route_paths.auth.login);
      }
    }
    if (error.response?.data) {
      throw new Error(JSON.stringify(error.response?.data)).message;
    }
    throw new Error(JSON.stringify({})).message;
  }
);

export default api;
