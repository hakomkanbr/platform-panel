import { getGatewayClient } from "./gateway-client";
import type {
  PlanDto,
  SubscriptionDto,
  CanConsumeRequest,
  CanConsumeResponse,
  UpgradeSubscriptionRequest,
  DowngradeSubscriptionRequest,
  PaymentSimulationRequest,
  InvoiceDto,
  PlanChangeResult,
  ManualOverrideRequest,
  ProratedPriceRequest,
  ProratedPriceResponse,
  CreditNoteDto,
  RenewSubscriptionRequest,
  RenewResult,
  PlanOverrideDto,
  CreatePlanOverrideRequest,
} from "@repo/shared-types";

function normalizeInvoice(invoice: any): InvoiceDto {
  if (!invoice) return invoice;
  return {
    ...invoice,
    totalAmount: invoice.totalAmount ?? invoice.amount ?? 0,
    subtotal: invoice.subtotal ?? invoice.amount ?? 0,
    taxAmount: invoice.taxAmount ?? 0,
    discountAmount: invoice.discountAmount ?? 0,
    description: invoice.description ?? invoice.notes ?? "",
    dueDate: invoice.dueDate ?? invoice.billingPeriodEnd ?? undefined,
    invoiceNumber: invoice.invoiceNumber ?? "",
    lineItems: typeof invoice.lineItems === "string"
      ? JSON.parse(invoice.lineItems)
      : invoice.lineItems ?? [],
  };
}

export const billingApi = {
  getCurrentSubscription: async (tenantId?: string): Promise<SubscriptionDto> => {
    const client = getGatewayClient();
    const url = tenantId
      ? `/api/v1/subscriptions/current?tenantId=${tenantId}`
      : "/api/v1/subscriptions/current";
    const response = await client.get<{ success: boolean; data: SubscriptionDto }>(url);
    return response.data.data || {
      id: '',
      tenantId: tenantId || '',
      planId: null,
      planName: null,
      status: 'none' as const,
      schemaVersion: 'v1',
      isActive: false,
      startDate: new Date(0).toISOString(),
      currentPeriodEnd: null,
    };
  },

  getAllPlans: async (): Promise<PlanDto[]> => {
    const client = getGatewayClient();
    const response = await client.get<{ success: boolean; data: PlanDto[] }>("/api/v1/plans");
    return response.data.data;
  },

  getPlan: async (planId: string): Promise<PlanDto> => {
    const client = getGatewayClient();
    const response = await client.get<{ success: boolean; data: PlanDto }>(`/api/v1/plans/${planId}`);
    return response.data.data;
  },

  canConsume: async (request: CanConsumeRequest): Promise<CanConsumeResponse> => {
    const client = getGatewayClient();
    const response = await client.post<CanConsumeResponse>("/api/v1/subscriptions/can-consume", request);
    return response.data;
  },

  upgradeSubscription: async (request: UpgradeSubscriptionRequest): Promise<PlanChangeResult> => {
    const client = getGatewayClient();
    const response = await client.put<{ success: boolean; data: PlanChangeResult }>("/api/v1/subscriptions/upgrade", request);
    return response.data.data;
  },

  downgradeSubscription: async (request: DowngradeSubscriptionRequest): Promise<PlanChangeResult> => {
    const client = getGatewayClient();
    const response = await client.put<{ success: boolean; data: PlanChangeResult }>("/api/v1/subscriptions/downgrade", request);
    return response.data.data;
  },

  simulatePayment: async (request: PaymentSimulationRequest): Promise<void> => {
    const client = getGatewayClient();
    await client.post("/api/v1/subscriptions/simulate-payment", request);
  },

  getInvoices: async (tenantId?: string): Promise<InvoiceDto[]> => {
    const client = getGatewayClient();
    const url = tenantId
      ? `/api/v1/billing/invoices?tenantId=${tenantId}`
      : "/api/v1/billing/invoices";
    const response = await client.get<{ success: boolean; data: InvoiceDto[] }>(url);
    return (response.data.data || []).map(normalizeInvoice);
  },

  getInvoiceById: async (invoiceId: string): Promise<InvoiceDto> => {
    const client = getGatewayClient();
    const response = await client.get<{ success: boolean; data: InvoiceDto }>(`/api/v1/billing/invoices/${invoiceId}`);
    return normalizeInvoice(response.data.data);
  },

  createInvoice: async (data: {
    tenantId: string;
    planId: string;
    amount: number;
    oldPlanId?: string;
    description?: string;
  }): Promise<InvoiceDto> => {
    const client = getGatewayClient();
    const response = await client.post<{ success: boolean; data: InvoiceDto }>("/api/v1/billing/invoice/create", data);
    return normalizeInvoice(response.data.data);
  },

  createSubscription: async (tenantId: string, planId: string): Promise<void> => {
    const client = getGatewayClient();
    await client.post("/api/v1/subscriptions", { tenantId, planId });
  },

  getProratedPrice: async (request: ProratedPriceRequest): Promise<ProratedPriceResponse> => {
    const client = getGatewayClient();
    const response = await client.post<{ success: boolean; data: ProratedPriceResponse }>(
      "/api/v1/subscriptions/prorated-price", request,
    );
    return response.data.data;
  },

  applyManualOverride: async (request: ManualOverrideRequest): Promise<SubscriptionDto> => {
    const client = getGatewayClient();
    const response = await client.put<{ success: boolean; data: SubscriptionDto }>(
      `/api/v1/subscriptions/${request.subscriptionId}/override`, request,
    );
    return response.data.data;
  },

  renewSubscription: async (request: RenewSubscriptionRequest): Promise<RenewResult> => {
    const client = getGatewayClient();
    const response = await client.post<{ success: boolean; data: RenewResult }>(
      `/api/v1/subscriptions/${request.tenantId}/renew`, request,
    );
    return response.data.data;
  },

  cancelSubscription: async (tenantId: string, immediate: boolean = false): Promise<PlanChangeResult> => {
    const client = getGatewayClient();
    const response = await client.put<{ success: boolean; data: PlanChangeResult }>(
      `/api/v1/subscriptions/${tenantId}/cancel`, { immediate });
    return response.data.data;
  },

  getCreditNotes: async (tenantId?: string): Promise<CreditNoteDto[]> => {
    const client = getGatewayClient();
    const url = tenantId
      ? `/api/v1/billing/credit-notes?tenantId=${tenantId}`
      : "/api/v1/billing/credit-notes";
    const response = await client.get<{ success: boolean; data: CreditNoteDto[] }>(url);
    return response.data.data;
  },

  downloadInvoicePdf: async (invoiceId: string): Promise<Blob> => {
    const client = getGatewayClient();
    const response = await client.get<Blob>(`/api/v1/billing/invoices/${invoiceId}/pdf`, {
      responseType: "blob",
    });
    return response.data;
  },

  updateInvoiceStatus: async (invoiceId: string, status: string): Promise<InvoiceDto> => {
    const client = getGatewayClient();
    const response = await client.put<{ success: boolean; data: InvoiceDto }>(`/api/v1/billing/invoices/${invoiceId}/status`, { status });
    return normalizeInvoice(response.data.data);
  },

  getAllOverdueInvoices: async (): Promise<InvoiceDto[]> => {
    const client = getGatewayClient();
    const response = await client.get<{ success: boolean; data: InvoiceDto[] }>("/api/v1/billing/invoices/overdue");
    return (response.data.data || []).map(normalizeInvoice);
  },

  getPlanOverrides: async (tenantId?: string): Promise<PlanOverrideDto[]> => {
    const client = getGatewayClient();
    const url = tenantId
      ? `/api/v1/plan-overrides?tenantId=${tenantId}`
      : "/api/v1/plan-overrides";
    const response = await client.get<{ success: boolean; data: PlanOverrideDto[] }>(url);
    return response.data.data;
  },

  createPlanOverride: async (request: CreatePlanOverrideRequest): Promise<PlanOverrideDto> => {
    const client = getGatewayClient();
    const response = await client.post<{ success: boolean; data: PlanOverrideDto }>("/api/v1/plan-overrides", request);
    return response.data.data;
  },

  deletePlanOverride: async (id: string): Promise<void> => {
    const client = getGatewayClient();
    await client.delete(`/api/v1/plan-overrides/${id}`);
  },
};
