import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { billingApi } from "@repo/api-client";
import type {
  PlanDto,
  SubscriptionDto,
  InvoiceDto,
  PlanChangeResult,
  UpgradeSubscriptionRequest,
  DowngradeSubscriptionRequest,
  CanConsumeRequest,
  CanConsumeResponse,
  PaymentSimulationRequest,
  ManualOverrideRequest,
  ProratedPriceRequest,
  ProratedPriceResponse,
  CreditNoteDto,
  RenewSubscriptionRequest,
  RenewResult,
  PlanOverrideDto,
  CreatePlanOverrideRequest,
} from "@repo/shared-types";
import { message } from "antd";

export function useCurrentSubscription(tenantId?: string) {
  return useQuery<SubscriptionDto, Error>({
    queryKey: ["subscription", "current", tenantId],
    queryFn: () => billingApi.getCurrentSubscription(tenantId),
    retry: 2,
  });
}

export function useAllPlans() {
  return useQuery<PlanDto[], Error>({
    queryKey: ["plans"],
    queryFn: () => billingApi.getAllPlans(),
    retry: 2,
  });
}

export function useCanConsume() {
  return useMutation<CanConsumeResponse, Error, CanConsumeRequest>({
    mutationFn: (request) => billingApi.canConsume(request),
    onError: (error) => {
      message.error(`${error.message}`);
    },
  });
}

export function useUpgradeSubscription() {
  const queryClient = useQueryClient();
  return useMutation<PlanChangeResult, Error, UpgradeSubscriptionRequest>({
    mutationFn: (request) => billingApi.upgradeSubscription(request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["subscription"] });
      queryClient.invalidateQueries({ queryKey: ["plans"] });
      queryClient.invalidateQueries({ queryKey: ["invoices"] });
      queryClient.invalidateQueries({ queryKey: ["wallet"] });
    },
  });
}

export function useDowngradeSubscription() {
  const queryClient = useQueryClient();
  return useMutation<PlanChangeResult, Error, DowngradeSubscriptionRequest>({
    mutationFn: (request) => billingApi.downgradeSubscription(request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["subscription"] });
      queryClient.invalidateQueries({ queryKey: ["plans"] });
      queryClient.invalidateQueries({ queryKey: ["invoices"] });
      queryClient.invalidateQueries({ queryKey: ["wallet"] });
    },
  });
}

export function useSimulatePayment() {
  return useMutation<void, Error, PaymentSimulationRequest>({
    mutationFn: (request) => billingApi.simulatePayment(request),
    onSuccess: () => {
      message.success("Payment processed successfully");
    },
    onError: (error) => {
      message.error(`Payment failed: ${error.message}`);
    },
  });
}

export function useCreateSubscription() {
  const queryClient = useQueryClient();
  return useMutation<void, Error, { tenantId: string; planId: string }>({
    mutationFn: ({ tenantId, planId }) =>
      billingApi.createSubscription(tenantId, planId),
    onSuccess: () => {
      message.success("Subscription created successfully");
      queryClient.invalidateQueries({ queryKey: ["subscription"] });
      queryClient.invalidateQueries({ queryKey: ["plans"] });
      queryClient.invalidateQueries({ queryKey: ["invoices"] });
    },
  });
}

export function useInvoices(tenantId?: string) {
  return useQuery<InvoiceDto[], Error>({
    queryKey: ["invoices", tenantId],
    queryFn: () => billingApi.getInvoices(tenantId),
    retry: 2,
  });
}

export function useInvoiceById(invoiceId: string) {
  return useQuery<InvoiceDto, Error>({
    queryKey: ["invoices", invoiceId],
    queryFn: () => billingApi.getInvoiceById(invoiceId),
    enabled: !!invoiceId,
    retry: 2,
  });
}

export function useProratedPrice() {
  return useMutation<ProratedPriceResponse, Error, ProratedPriceRequest>({
    mutationFn: (request) => billingApi.getProratedPrice(request),
  });
}

export function useApplyManualOverride() {
  const queryClient = useQueryClient();
  return useMutation<SubscriptionDto, Error, ManualOverrideRequest>({
    mutationFn: (request) => billingApi.applyManualOverride(request),
    onSuccess: () => {
      message.success("Override applied successfully");
      queryClient.invalidateQueries({ queryKey: ["subscription"] });
    },
    onError: (error) => {
      message.error(`Failed to apply override: ${error.message}`);
    },
  });
}

export function useRenewSubscription() {
  const queryClient = useQueryClient();
  return useMutation<RenewResult, Error, RenewSubscriptionRequest>({
    mutationFn: (request) => billingApi.renewSubscription(request),
    onSuccess: () => {
      message.success("Subscription renewed successfully");
      queryClient.invalidateQueries({ queryKey: ["subscription"] });
      queryClient.invalidateQueries({ queryKey: ["invoices"] });
      queryClient.invalidateQueries({ queryKey: ["wallet"] });
    },
    onError: (error) => {
      message.error(`Renewal failed: ${error.message}`);
    },
  });
}

export function useCancelSubscription() {
  const queryClient = useQueryClient();
  return useMutation<PlanChangeResult, Error, { tenantId: string; immediate: boolean }>({
    mutationFn: ({ tenantId, immediate }) =>
      billingApi.cancelSubscription(tenantId, immediate),
    onSuccess: (data) => {
      const refund = data.proratedRefund;
      if (refund && refund.refundAmount > 0) {
        message.success(`Subscription cancelled. Prorated refund of $${refund.refundAmount.toFixed(2)} credited to wallet.`);
      } else {
        message.success("Subscription cancelled.");
      }
      queryClient.invalidateQueries({ queryKey: ["subscription"] });
      queryClient.invalidateQueries({ queryKey: ["invoices"] });
      queryClient.invalidateQueries({ queryKey: ["wallet"] });
      queryClient.invalidateQueries({ queryKey: ["credit-notes"] });
    },
    onError: (error) => {
      message.error(`Cancellation failed: ${error.message}`);
    },
  });
}

export function useCreditNotes(tenantId?: string) {
  return useQuery<CreditNoteDto[], Error>({
    queryKey: ["credit-notes", tenantId],
    queryFn: () => billingApi.getCreditNotes(tenantId),
    retry: 2,
  });
}

export function useDownloadInvoice() {
  return useMutation<Blob, Error, string>({
    mutationFn: (invoiceId: string) => billingApi.downloadInvoicePdf(invoiceId),
  });
}

export function useUpdateInvoiceStatus() {
  const queryClient = useQueryClient();
  return useMutation<
    InvoiceDto,
    Error,
    { invoiceId: string; status: string }
  >({
    mutationFn: ({ invoiceId, status }) =>
      billingApi.updateInvoiceStatus(invoiceId, status),
    onSuccess: (_, variables) => {
      message.success(`Invoice status updated to ${variables.status}`);
      queryClient.invalidateQueries({ queryKey: ["invoices"] });
    },
    onError: (error) => {
      message.error(`Failed to update invoice: ${error.message}`);
    },
  });
}

export function useAllOverdueInvoices() {
  return useQuery<InvoiceDto[], Error>({
    queryKey: ["invoices", "overdue"],
    queryFn: () => billingApi.getAllOverdueInvoices(),
    retry: 2,
  });
}

export function usePlanOverrides(tenantId?: string) {
  return useQuery<PlanOverrideDto[], Error>({
    queryKey: ["plan-overrides", tenantId],
    queryFn: () => billingApi.getPlanOverrides(tenantId),
    retry: 2,
  });
}

export function useCreatePlanOverride() {
  const queryClient = useQueryClient();
  return useMutation<PlanOverrideDto, Error, CreatePlanOverrideRequest>({
    mutationFn: (request) => billingApi.createPlanOverride(request),
    onSuccess: () => {
      message.success("Override created successfully");
      queryClient.invalidateQueries({ queryKey: ["plan-overrides"] });
    },
    onError: (error) => {
      message.error(`Failed to create override: ${error.message}`);
    },
  });
}

export function useDeletePlanOverride() {
  const queryClient = useQueryClient();
  return useMutation<void, Error, string>({
    mutationFn: (id) => billingApi.deletePlanOverride(id),
    onSuccess: () => {
      message.success("Override deleted");
      queryClient.invalidateQueries({ queryKey: ["plan-overrides"] });
    },
    onError: (error) => {
      message.error(`Failed to delete override: ${error.message}`);
    },
  });
}
