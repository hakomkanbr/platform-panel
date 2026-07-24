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
  let token = await getCookie("access_token");
  if (req.headers && token) {
    const headers = req.headers as any;
    headers["Authorization"] = `Bearer ${token}`
  }

  return req;
});

api.interceptors.response.use(
  (config: any) => {
    return config;
  },
  (error: AxiosError<any>) => {
    // if (error.response?.status === 401) {
    //   console.info("error.response => " ,error.response);
    //   deleteCookie("AuthLogin");
    //   if (typeof window !== "undefined") {
    //     // إعادة التوجيه في client-side فقط
    //     window.location.href = route_paths.auth.login;
    //   }else{
    //     redirect(route_paths.auth.login);
    //   }
    // }
    if (error.response?.data) {
      throw new Error(JSON.stringify(error.response?.data)).message;
    }
    throw new Error(JSON.stringify({})).message;
  }
);

export default api;
