import { getGatewayClient } from './gateway-client'
import type { UsageDto, UsageSummaryDto, UsageSummaryItem } from "@repo/shared-types"

export const usageApi = {
  getCurrentUsage: async (capabilityCode: string, tenantId?: string): Promise<UsageDto> => {
    const client = getGatewayClient()
    const url = tenantId
      ? `/api/v1/usage/current/${capabilityCode}?tenantId=${tenantId}`
      : `/api/v1/usage/current/${capabilityCode}`
    const response = await client.get<{ success: boolean; data: any }>(url)
    const raw = response.data.data
    return {
      tenantId: raw.tenantId || tenantId || '',
      capabilityCode: raw.capabilityCode || capabilityCode,
      currentValue: raw.currentUsage || 0,
      limitValue: 0,
      percentageUsed: 0,
    }
  },

  getUsageSummary: async (tenantId?: string): Promise<UsageSummaryDto> => {
    const client = getGatewayClient()
    const url = tenantId
      ? `/api/v1/usage/summary?tenantId=${tenantId}`
      : '/api/v1/usage/summary'
    const response = await client.get<{ success: boolean; data: UsageSummaryItem[] }>(url)
    const items = response.data.data || []
    return {
      tenantId: tenantId || '',
      planName: undefined,
      usages: items.map(item => ({
        tenantId: tenantId || '',
        capabilityCode: item.CapabilityCode,
        capabilityName: item.CapabilityCode,
        currentValue: item.UsedAmount,
        limitValue: item.LimitAmount,
        percentageUsed: item.UsagePercentage,
        unit: '',
      })),
    }
  },

  logUsage: async (request: any): Promise<void> => {
    const client = getGatewayClient()
    await client.post('/api/v1/usage/log', request)
  },

  getAlerts: async (): Promise<any[]> => {
    const client = getGatewayClient()
    const response = await client.get<{ success: boolean; data: any[] }>('/api/v1/usage/alerts')
    return response.data.data || []
  },
}
