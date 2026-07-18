import api from "../api-context";
import api_points from "../points";
import { IModule } from "@/types/page";

// جلب كل الوحدات
export const getModules = async (): Promise<{
  data: IModule[];
  total : number
}> => {
  const response = await api.get(api_points.module.getAll);
  return response.data;
};

// جلب وحدة واحدة مع inputs
export const getModuleById = async (id: number): Promise<IModule> => {
  const response = await api.get(`${api_points.module.getOne}/${id}`);
  return response.data;
};
