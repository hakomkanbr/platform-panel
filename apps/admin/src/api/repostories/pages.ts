import api from "../api-context";
import api_points from "../points";
import { IPage, IPageBlock } from "@/types/page";

// جلب كل الصفحات
export const getPages = async () => {
  const response = await api.get(api_points.pages.getAll);
  return response.data;
};

// جلب صفحة واحدة
export const getPageById = async (id: number): Promise<IPage> => {
  const response = await api.get(`${api_points.pages.getOne}/${id}`);
  return response.data;
};

// Create a new page
export const createPage = async (data:any) => {
  const response = await api.post(api_points.pages.create, data);
  return response.data;
};

// تحديث صفحة موجودة
export const updatePage = async (
  id: number,
  data: any
) => {
  const response = await api.put(`${api_points.pages.update}/${id}`, data);
  return response.data;
};

// حذف صفحة
export const deletePage = async (id: number) => {
  const response = await api.delete(`${api_points.pages.delete}/${id}`);
  return response.data;
};
