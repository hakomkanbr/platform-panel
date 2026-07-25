import api from "../api-context";
import api_points from "../points";

const templatesRepository = {
    getAll: async (params?: any) => {
        return await api.get(api_points.template.getAll, { params });
    },

    getOne: async (id: number) => {
        return await api.get(`${api_points.template.getOne}/${id}`);
    },

    create: async (data: any) => {
        return await api.post(api_points.template.create, data);
    },

    update: async (id: number, data: any) => {
        return await api.put(`${api_points.template.update}/${id}`, data);
    },

    delete: async (id: number) => {
        return await api.delete(`${api_points.template.delete}/${id}`);
    }
};

export default templatesRepository;
