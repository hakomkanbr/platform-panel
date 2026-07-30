import api from "@/api/api-context";
import api_points from "@/api/points";

export async function confirmEmail(email:string,token:string) {
    (await api.get(api_points.auth.confirmEmail + `?email=${email}&token=${encodeURIComponent(token)}`, {}));
}
