import api from "./api-context";

export const postData = async ( url: string, data: any) => {
    const response = await api.post(url, data);
    return response.data;
}