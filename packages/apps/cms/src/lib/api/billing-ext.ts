import { getGatewayClient } from "./gateway-client"
import type { PlanCapability } from "@/types/apps"

export const billingExtApi = {
  getCurrentCapabilities: async (tenantId?: string): Promise<Record<string, PlanCapability>> => {
    const client = getGatewayClient()
    const url = tenantId
      ? `/api/v1/subscriptions/current/capabilities?tenantId=${tenantId}`
      : "/api/v1/subscriptions/current/capabilities"
    const response = await client.get<{ success: boolean; data: Record<string, PlanCapability> }>(url)
    return response.data.data
  },
}
