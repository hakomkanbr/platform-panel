import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { walletApi } from '@repo/api-client'
import type {
  WalletDto,
  WalletTransactionDto,
  WalletAdjustmentRequest,
  WalletAdjustmentResponse,
  RefundToWalletRequest,
  TopUpRequestDto,
  CreateTopUpRequest,
  BankDetailsDto,
  CardPaymentRequest,
  CardPaymentResponse,
} from "@repo/shared-types"
import { message } from 'antd'

export function useWallet(tenantId?: string) {
  return useQuery<WalletDto, Error>({
    queryKey: ['wallet', tenantId],
    queryFn: () => walletApi.getWallet(tenantId),
    retry: 2,
  })
}

export function useWalletTransactions(tenantId?: string) {
  return useQuery<WalletTransactionDto[], Error>({
    queryKey: ['wallet', 'transactions', tenantId],
    queryFn: () => walletApi.getWalletTransactions(tenantId),
    retry: 2,
  })
}

export function useAdjustWallet() {
  const queryClient = useQueryClient()
  return useMutation<WalletAdjustmentResponse, Error, WalletAdjustmentRequest>({
    mutationFn: (request) => walletApi.adjustWallet(request),
    onSuccess: () => {
      message.success('Wallet adjusted successfully')
      queryClient.invalidateQueries({ queryKey: ['wallet'] })
      queryClient.invalidateQueries({ queryKey: ['wallet', 'transactions'] })
    },
    onError: (error) => {
      message.error(`Wallet adjustment failed: ${error.message}`)
    },
  })
}

export function useRefundToWallet() {
  const queryClient = useQueryClient()
  return useMutation<WalletAdjustmentResponse, Error, RefundToWalletRequest>({
    mutationFn: (request) => walletApi.refundToWallet(request),
    onSuccess: () => {
      message.success('Refund processed to wallet')
      queryClient.invalidateQueries({ queryKey: ['wallet'] })
      queryClient.invalidateQueries({ queryKey: ['wallet', 'transactions'] })
      queryClient.invalidateQueries({ queryKey: ['invoices'] })
    },
    onError: (error) => {
      message.error(`Refund failed: ${error.message}`)
    },
  })
}

export function useCreateTopUpRequest() {
  const queryClient = useQueryClient()
  return useMutation<TopUpRequestDto, Error, CreateTopUpRequest>({
    mutationFn: (request) => walletApi.createTopUpRequest(request),
    onSuccess: () => {
      message.success('Top-up request submitted. Awaiting admin approval.')
      queryClient.invalidateQueries({ queryKey: ['wallet', 'topup'] })
    },
    onError: (error) => {
      message.error(`Failed to submit top-up request: ${error.message}`)
    },
  })
}

export function useMyTopUpRequests(status?: string) {
  return useQuery<TopUpRequestDto[], Error>({
    queryKey: ['wallet', 'topup', 'my', status],
    queryFn: () => walletApi.getMyTopUpRequests(status),
  })
}

export function useBankDetails() {
  return useQuery<BankDetailsDto, Error>({
    queryKey: ['wallet', 'bank-details'],
    queryFn: () => walletApi.getBankDetails(),
    staleTime: 1000 * 60 * 60,
  })
}

export function useCardPayment() {
  const queryClient = useQueryClient()
  return useMutation<CardPaymentResponse, Error, CardPaymentRequest>({
    mutationFn: (request) => walletApi.processCardPayment(request),
    onSuccess: (data) => {
      message.success(`Card payment of $${data.wallet.balance.toFixed(2)} successful!`)
      queryClient.invalidateQueries({ queryKey: ['wallet'] })
      queryClient.invalidateQueries({ queryKey: ['wallet', 'transactions'] })
    },
    onError: (error) => {
      message.error(`Card payment failed: ${error.message}`)
    },
  })
}
