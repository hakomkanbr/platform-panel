import api from "../api-context";

export const getFieldsByModule = async (moduleId: number|string) => {
  const { data } = await api.get(`/admin/field/by-module/${moduleId}`);
  return data;
};

export const getFieldById = async (fieldId: number) => {
  const { data } = await api.get(`/admin/field/${fieldId}`);
  return data;
};

export const createField = async (field: any) => {
  const { data } = await api.post("/admin/field", field);
  return data;
};

export const updateField = async (fieldId: number, field: any) => {
  const { data } = await api.put(`/admin/field/${fieldId}`, field);
  return data;
};

export const deleteField = async (fieldId: number) => {
  const { data } = await api.delete(`/admin/field/${fieldId}`);
  return data;
};
