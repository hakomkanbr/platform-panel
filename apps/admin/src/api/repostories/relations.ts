import api from "../api-context";
import api_points from "../points";

const relationsRepository = {
    getAll: async (params?: any) => {
        return await api.get(api_points.relation.getAll, { params });
    },
    
    getOne: async (id: number) => {
        return await api.get(`${api_points.relation.getOne}/${id}`);
    },
    
    create: async (data: any) => {
        return await api.post(api_points.relation.create, data);
    },
    
    update: async (id: number, data: any) => {
        return await api.put(`${api_points.relation.update}/${id}`, data);
    },
    
    delete: async (id: number) => {
        return await api.delete(`${api_points.relation.delete}/${id}`);
    }
};

export default relationsRepository;