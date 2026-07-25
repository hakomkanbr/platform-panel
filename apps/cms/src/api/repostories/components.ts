import api from "@/api/api-context";
import api_points from "@/api/points";

export const getComponents = async () => {
  const response = await api.get(api_points.component.getAll);
  return response.data?.data || response.data || [];
};

export const getComponentById = async (id: number) => {
  const response = await api.get(`${api_points.component.getOne}/${id}`);
  return response.data?.data || response.data;
};

export const createComponent = async (data: any) => {
  const response = await api.post(api_points.component.create, data);
  return response.data?.data || response.data;
};

export const updateComponent = async (id: number, data: any) => {
  const response = await api.put(`${api_points.component.update}/${id}`, data);
  return response.data;
};

export const deleteComponent = async (id: number) => {
  const response = await api.delete(`${api_points.component.delete}/${id}`);
  return response.data;
};

export const createComponentField = async (componentId: number, data: any) => {
  const response = await api.post(
    `${api_points.component.createField.replace("{componentId}", String(componentId))}`,
    data
  );
  return response.data?.data || response.data;
};

export const deleteComponentField = async (id: number) => {
  const response = await api.delete(
    `${api_points.component.deleteField.replace("{id}", String(id))}`
  );
  return response.data;
};
