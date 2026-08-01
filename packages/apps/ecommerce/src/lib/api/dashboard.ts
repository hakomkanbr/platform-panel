import { apiGet } from "./client";
import type { DashboardSummary, MonthlySale, DailySale, TopProduct, TopBrand, OrderSummary } from "@/types";

export const dashboardApi = {
  summary: () => apiGet<DashboardSummary>("/Admin/Dashboard/summary"),
  monthlySales: () => apiGet<MonthlySale[]>("/Admin/Dashboard/sales/monthly"),
  dailySales: () => apiGet<DailySale[]>("/Admin/Dashboard/sales/daily"),
  topProducts: () => apiGet<TopProduct[]>("/Admin/Dashboard/top-products"),
  topBrands: () => apiGet<TopBrand[]>("/Admin/Dashboard/top-brands"),
  orders: () => apiGet<OrderSummary>("/Admin/Dashboard/orders"),
};
