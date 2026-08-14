import { apiGet } from "./client";
import type { DashboardSummary, MonthlySale, DailySale, TopProduct, TopBrand, OrderSummary } from "@/types";

export const dashboardApi = {
  summary: () => apiGet<DashboardSummary>("/Admin/v1/Dashboard/summary"),
  monthlySales: () => apiGet<MonthlySale[]>("/Admin/v1/Dashboard/sales/monthly"),
  dailySales: () => apiGet<DailySale[]>("/Admin/v1/Dashboard/sales/daily"),
  topProducts: () => apiGet<TopProduct[]>("/Admin/v1/Dashboard/top-products"),
  topBrands: () => apiGet<TopBrand[]>("/Admin/v1/Dashboard/top-brands"),
  orders: () => apiGet<OrderSummary>("/Admin/v1/Dashboard/orders"),
};
