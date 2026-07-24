export interface PlanDto {
  id: string;
  name: string;
  displayName: string;
  description?: string;
  price: number;
  billingCycle: string;
  maxUsers: number;
  maxStorageGB: number;
  isActive: boolean;
  schemaVersion: string;
  createdAt: string;
  features: PlanFeatureDto[];
}

export interface PlanFeatureDto {
  capabilityCode: string;
  capabilityName: string;
  capabilityType: string;
  value: number;
  unit?: string;
}

export interface SubscriptionDto {
  id: string;
  tenantId: string;
  planId: string | null;
  planName?: string | null;
  status: "none" | "trial" | "active" | "past_due" | "canceled" | "expired";
  schemaVersion: string;
  isActive: boolean;
  startDate: string;
  currentPeriodEnd: string | null;
  overrides?: SubscriptionOverrideDto[];
}

export interface SubscriptionOverrideDto {
  id: string;
  subscriptionId: string;
  capabilityCode: string;
  overrideValue: number;
  reason: string;
  overrideType: "capability_override" | "date_extension" | "custom_discount" | "fee_waiver";
  expiresAt?: string;
  appliedBy?: string;
  createdAt: string;
}

export interface InvoiceDto {
  id: string;
  tenantId: string;
  planId: string;
  oldPlanId?: string;
  oldPlanName: string;
  newPlanName: string;
  amount: number;
  taxAmount: number;
  discountAmount: number;
  subtotal: number;
  totalAmount: number;
  currency: string;
  status: string;
  invoiceType: string;
  invoiceNumber: string;
  description?: string;
  lineItems?: any[];
  createdAt: string;
  paidAt?: string;
  dueDate?: string;
  billingPeriodStart?: string;
  billingPeriodEnd?: string;
  paymentMethod?: string;
  notes?: string;
  pdfUrl?: string;
}

export interface CreditNoteDto {
  id: string;
  invoiceId: string | null;
  tenantId: string;
  creditNoteNumber: string;
  amount: number;
  currency: string;
  reason: string;
  status: string;
  createdAt: string;
}

export interface PlanChangeResult {
  subscription: SubscriptionDto;
  invoice: InvoiceDto;
  creditNote?: CreditNoteDto;
  proratedRefund?: ProratedRefundCalculation;
  proratedCharge?: ProratedChargeCalculation;
  walletBalanceAfter?: number;
  amountCharged?: number;
}

export interface RenewResult {
  subscription: SubscriptionDto;
  invoice: InvoiceDto;
  amountCharged: number;
  walletBalanceAfter: number;
}

export interface PlanOverrideDto {
  id: string;
  tenantId: string;
  overrideType: string;
  value: string;
  expiresAt?: string;
  reason: string;
  appliedBy: string;
  createdAt: string;
  isExpired: boolean;
}

export interface UpgradeSubscriptionRequest {
  planId: string;
  tenantId: string;
  customDiscount?: number;
  discountReason?: string;
  waiveUpgradeFee?: boolean;
  idempotencyKey?: string;
}

export interface DowngradeSubscriptionRequest extends UpgradeSubscriptionRequest {
  refundToWallet?: boolean;
  customRefundAmount?: number;
  refundReason?: string;
}

export interface CanConsumeRequest {
  tenantId: string;
  capabilityCode: string;
  requestedAmount: number;
}

export interface CanConsumeResponse {
  allowed: boolean;
  currentUsage?: number;
  limit?: number;
  message?: string;
}

export interface PaymentSimulationRequest {
  tenantId: string;
  planId: string;
  amount: number;
  currency: string;
}

export interface ProratedRefundCalculation {
  refundAmount: number;
  currency: string;
  totalDays: number;
  remainingDays: number;
  currentDailyRate: number;
  newDailyRate: number;
  description: string;
}

export interface ProratedChargeCalculation {
  chargeAmount: number;
  currency: string;
  totalDays: number;
  remainingDays: number;
  rateDifference: number;
  description: string;
}

export interface ManualOverrideRequest {
  subscriptionId: string;
  tenantId: string;
  overrideType: string;
  capabilityCode?: string;
  overrideValue?: number;
  reason: string;
  expiresAt?: string;
}

export interface RenewSubscriptionRequest {
  tenantId: string;
  billingCycle?: string;
}

export interface ProratedPriceRequest {
  planId: string;
  tenantId: string;
  action: "upgrade" | "downgrade" | "new";
}

export interface ProratedPriceResponse {
  currentPlanPrice: number;
  targetPlanPrice: number;
  currentPlanCredit: number;
  newPlanCharge: number;
  netAmount: number;
  proratedCharge: number;
  proratedRefund: number;
  dailyRateCurrent: number;
  dailyRateTarget: number;
  remainingDays: number;
  totalDays: number;
  currency: string;
  isNewSubscription?: boolean;
}

export interface CreatePlanOverrideRequest {
  tenantId: string;
  overrideType: string;
  value: string;
  reason: string;
  expiresAt?: string;
}
