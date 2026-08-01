export interface DashboardSummary {
  productsCount: number;
  brandsCount: number;
  customersCount: number;
  ordersCount: number;
  revenueThisMonth: number;
}

export interface MonthlySale {
  month: string;
  total: number;
}

export interface DailySale {
  day: string;
  total: number;
}

export interface TopProduct {
  name: string;
  sales: number;
}

export interface TopBrand {
  name: string;
  sales: number;
}

export interface OrderSummary {
  awaitingApproval: number;
  awaitingPayment: number;
  paymentFaild: number;
  refunded: number;
  refundFailed: number;
  processing: number;
  paymentPaid: number;
  delivered: number;
  inCargo: number;
  cancelled: number;
}
