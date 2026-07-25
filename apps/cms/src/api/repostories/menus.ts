import api from "@/api/api-context";
import api_points from "@/api/points";

export const getMenus = async () => {
  const response = await api.get(api_points.menu.getAll);
  return response.data?.data || response.data || [];
};

export const getMenuById = async (id: number) => {
  const response = await api.get(`${api_points.menu.getOne}/${id}`);
  return response.data?.data || response.data;
};

export const createMenu = async (data: any) => {
  const response = await api.post(api_points.menu.create, data);
  return response.data?.data || response.data;
};

export const updateMenu = async (id: number, data: any) => {
  const response = await api.put(`${api_points.menu.update}/${id}`, data);
  return response.data;
};

export const deleteMenu = async (id: number) => {
  const response = await api.delete(`${api_points.menu.delete}/${id}`);
  return response.data;
};

export const createMenuItem = async (menuId: number, data: any) => {
  const response = await api.post(`${api_points.menu.createItem.replace("{menuId}", String(menuId))}`, data);
  return response.data?.data || response.data;
};

export const updateMenuItem = async (id: number, data: any) => {
  const response = await api.put(`${api_points.menu.updateItem.replace("{id}", String(id))}`, data);
  return response.data;
};

export const deleteMenuItem = async (id: number) => {
  const response = await api.delete(`${api_points.menu.deleteItem.replace("{id}", String(id))}`);
  return response.data;
};
