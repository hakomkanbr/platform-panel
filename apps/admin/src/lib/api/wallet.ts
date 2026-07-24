import { getGatewayClient } from "./gateway-client";
import type {
  WalletDto,
  WalletTransactionDto,
  WalletAdjustmentRequest,
  WalletAdjustmentResponse,
  TopUpRequestDto,
  CreateTopUpRequest,
  BankDetailsDto,
  CardPaymentRequest,
  CardPaymentResponse,
} from "@/types/wallet";

export const walletApi = {
  getWallet: async (tenantId?: string): Promise<WalletDto> => {
    const client = getGatewayClient();
    const url = tenantId
      ? `/api/v1/wallet?tenantId=${tenantId}`
      : "/api/v1/wallet";
    const response = await client.get<{ success: boolean; data: WalletDto }>(url);
    return response.data.data;
  },

  getWalletTransactions: async (tenantId?: string): Promise<WalletTransactionDto[]> => {
    const client = getGatewayClient();
    const url = tenantId
      ? `/api/v1/wallet/transactions?tenantId=${tenantId}`
      : "/api/v1/wallet/transactions";
    const response = await client.get<{ success: boolean; data: WalletTransactionDto[] }>(url);
    return response.data.data;
  },

  adjustWallet: async (request: WalletAdjustmentRequest): Promise<WalletAdjustmentResponse> => {
    const client = getGatewayClient();
    const response = await client.post<{ success: boolean; data: WalletAdjustmentResponse }>(
      "/api/v1/wallet/adjust", request,
    );
    return response.data.data;
  },

  refundToWallet: async (request: {
    tenantId: string;
    subscriptionId: string;
    oldPlanId: string;
    newPlanId: string;
    refundAmount: number;
    currency: string;
  }): Promise<WalletAdjustmentResponse> => {
    const client = getGatewayClient();
    const response = await client.post<{ success: boolean; data: WalletAdjustmentResponse }>(
      "/api/v1/wallet/refund", request,
    );
    return response.data.data;
  },

  createTopUpRequest: async (request: CreateTopUpRequest): Promise<TopUpRequestDto> => {
    const client = getGatewayClient();
    const response = await client.post<{ success: boolean; data: TopUpRequestDto }>(
      "/api/v1/wallet/top-up-requests", request,
    );
    return response.data.data;
  },

  getMyTopUpRequests: async (status?: string): Promise<TopUpRequestDto[]> => {
    const client = getGatewayClient();
    const url = status
      ? `/api/v1/wallet/top-up-requests/my?status=${status}`
      : "/api/v1/wallet/top-up-requests/my";
    const response = await client.get<{ success: boolean; data: TopUpRequestDto[] }>(url);
    return response.data.data;
  },

  getBankDetails: async (): Promise<BankDetailsDto> => {
    const client = getGatewayClient();
    const response = await client.get<{ success: boolean; data: BankDetailsDto }>(
      "/api/v1/wallet/bank-details",
    );
    return response.data.data;
  },

  processCardPayment: async (request: CardPaymentRequest): Promise<CardPaymentResponse> => {
    const client = getGatewayClient();
    const response = await client.post<{ success: boolean; data: CardPaymentResponse }>(
      "/api/v1/wallet/card-payment", request,
    );
    return response.data.data;
  },
};
