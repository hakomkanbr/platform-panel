export interface UsageDto {
  tenantId: string
  capabilityCode: string
  capabilityName?: string
  currentValue: number
  limitValue: number
  percentageUsed: number
  unit?: string
}

export interface UsageSummaryDto {
  tenantId: string
  planName?: string
  usages: UsageDto[]
}

export interface UsageSummaryItem {
  CapabilityCode: string
  UsedAmount: number
  LimitAmount: number
  UsagePercentage: number
  VersionTag: string
}

export interface UsageChartDataPoint {
  date: string
  value: number
}

export interface UsageHistoryRequest {
  tenantId: string
  capabilityCode: string
  startDate?: string
  endDate?: string
}

export interface UsageHistoryResponse {
  data: UsageChartDataPoint[]
}
