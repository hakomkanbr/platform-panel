import * as http from "../http";
import type { PaginatedResult } from "../../types/common";
import type {
  OrderSummaryDto,
  OrderDetailDto,
  OrderFilters,
  EnumOrderStatus,
} from "../../types/orders";

export const ordersApi = {
  list: (params?: OrderFilters) =>
    http.get<PaginatedResult<OrderSummaryDto>>(
      "/Admin/v1/Orders",
      params as Record<string, unknown> | undefined,
    ),

  getById: (id: string) =>
    http.get<OrderDetailDto>(`/Admin/v1/Orders/${id}`),

  setStatus: (id: string, status: EnumOrderStatus) =>
    http.put<string>(`/Admin/v1/Orders/${id}/SetStatus/${status}`),
};
