export interface WalletDto {
  id: string;
  tenantId: string;
  balance: number;
  currency: string;
  updatedAt: string;
}

export interface WalletTransactionDto {
  id: string;
  walletId: string;
  tenantId: string;
  type: 'credit' | 'debit';
  source: 'refund' | 'adjustment' | 'payment' | 'subscription' | 'cardpayment' | 'topup';
  amount: number;
  signedAmount: number;
  currency: string;
  description: string;
  status: 'completed' | 'pending' | 'failed';
  createdAt: string;
}

export interface WalletAdjustmentRequest {
  tenantId: string;
  amount: number;
  reason: string;
}

export interface WalletAdjustmentResponse {
  wallet: WalletDto;
  transaction: WalletTransactionDto;
}

export interface RefundToWalletRequest {
  tenantId: string;
  subscriptionId: string;
  oldPlanId: string;
  newPlanId: string;
  refundAmount: number;
  currency: string;
}

export interface TopUpRequestDto {
  id: string;
  tenantId: string;
  amount: number;
  currency: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  adminNotes?: string;
  approvedBy?: string;
  approvedAt?: string;
  createdAt: string;
}

export interface CreateTopUpRequest {
  amount: number;
  currency?: string;
}

export interface BankDetailsDto {
  bankName: string;
  accountName: string;
  iban: string;
  swift: string;
}

export interface CardPaymentRequest {
  amount: number;
  currency?: string;
  cardholderName: string;
  cardNumber: string;
  expiryMonth: string;
  expiryYear: string;
  cvv: string;
}

export interface CardPaymentResponse {
  success: boolean;
  message: string;
  transactionId: string;
  paymentReference: string;
  wallet: WalletDto;
  transaction: WalletTransactionDto;
}
