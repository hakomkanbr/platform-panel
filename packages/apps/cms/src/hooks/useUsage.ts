import { useQuery } from '@tanstack/react-query'
import { usageApi } from '@/lib/api/usage'
import type { UsageDto, UsageSummaryDto, UsageHistoryRequest, UsageHistoryResponse } from '@/types'

export function useUsageSummary(tenantId?: string) {
  return useQuery<UsageSummaryDto, Error>({
    queryKey: ['usage', 'summary', tenantId],
    queryFn: () => usageApi.getUsageSummary(tenantId),
    retry: 2,
  })
}

export function useCurrentUsage(capabilityCode: string, tenantId?: string) {
  return useQuery<UsageDto, Error>({
    queryKey: ['usage', 'current', capabilityCode, tenantId],
    queryFn: () => usageApi.getCurrentUsage(capabilityCode, tenantId),
    enabled: !!capabilityCode,
    retry: 2,
  })
}

export function useUsageHistory(request: UsageHistoryRequest) {
  return useQuery<UsageHistoryResponse, Error>({
    queryKey: ['usage', 'history', request],
    queryFn: async () => {
      const usage = await usageApi.getCurrentUsage(request.capabilityCode, request.tenantId)
      return {
        data: [{
          date: new Date().toISOString().split('T')[0],
          value: usage.currentValue,
        }],
      }
    },
    enabled: !!request.capabilityCode,
    retry: 2,
  })
}
