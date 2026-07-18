import api from "@/api/api-context";
import api_points from "@/api/points";

export async function register(formData: FormData) {
    (await api.post(api_points.auth.register, formData));
}
