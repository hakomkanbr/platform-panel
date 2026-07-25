import api from "../api-context";
import api_points from "../points";

export const getThemes = async (params?: any) => {
    return await api.get(api_points.theme.getAll, { params });
};

export const getThemeById = async (id: number) => {
    return await api.get(`${api_points.theme.getOne}/${id}`);
};

export const createTheme = async (data: any) => {
    return await api.post(api_points.theme.create, data);
};

export const updateTheme = async (id: number, data: any) => {
    return await api.put(`${api_points.theme.update}/${id}`, data);
};

export const deleteTheme = async (id: number) => {
    return await api.delete(`${api_points.theme.delete}/${id}`);
};

export const activateTheme = async (id: number) => {
    return await api.put(`${api_points.theme.activate.replace("{id}", id.toString())}`, {});
};
