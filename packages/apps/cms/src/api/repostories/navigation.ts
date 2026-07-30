import api from "../api-context";
import api_points from "../points";
import { IPage } from "@/types/page";

export const getNavigations = async () => {
  const response = await api.get(api_points.navigation.getAll);
  return response.data;
};

export const getNavigationById = async (id: number): Promise<IPage> => {
  const response = await api.get(`${api_points.navigation.getOne}/${id}`);
  return response.data;
};

export const createNavigation = async (data:any) => {
  const response = await api.post(api_points.navigation.create, data);
  return response.data;
};

export const updateNavigation = async (
  id: number,
  data: any
) => {
  const response = await api.put(`${api_points.navigation.update}/${id}`, data);
  return response.data;
};

export const deleteNavigation = async (id: number) => {
  const response = await api.delete(`${api_points.navigation.delete}/${id}`);
  return response.data;
};
