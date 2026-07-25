import api from "../api-context";
import api_points from "../points";

export const getFieldsByModule = async (moduleId: number|string) => {
  const { data } = await api.get(api_points.module.getFields.replace("{moduleId}", String(moduleId)));
  return data;
};

export const getFieldById = async (fieldId: number) => {
  const { data } = await api.get(api_points.module.getField.replace("{id}", String(fieldId)));
  return data;
};

export const createField = async (field: any) => {
  const { data } = await api.post(api_points.module.createField.replace("{moduleId}", String(field.moduleId)), field);
  return data;
};

export const updateField = async (fieldId: number, field: any) => {
  const { data } = await api.put(api_points.module.updateField.replace("{id}", String(fieldId)), field);
  return data;
};

export const deleteField = async (fieldId: number) => {
  const { data } = await api.delete(api_points.module.deleteField.replace("{id}", String(fieldId)));
  return data;
};
