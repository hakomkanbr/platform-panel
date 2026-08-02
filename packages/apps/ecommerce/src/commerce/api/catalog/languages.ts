import { getGatewayClient } from "@repo/api-client";

export interface CommerceLanguage {
  id: string;
  projectId: string;
  code: string;
  name: string;
  nativeName: string;
  flag: string;
  rtl: boolean;
  enabled: boolean;
  isDefault: boolean;
  order: number;
}

interface GatewayResponse<T> {
  success?: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export const languagesApi = {
  async list(projectId: string): Promise<CommerceLanguage[]> {
    const res = await getGatewayClient().get(
      `/api/v1/languages/by-project/${projectId}`,
    );
    const body = res.data as GatewayResponse<CommerceLanguage[]>;
    if (body?.success === false) {
      throw new Error(body.error || body.message || "Failed to load languages");
    }
    return (body?.data ?? body ?? []) as CommerceLanguage[];
  },
};