import * as http from "../http";
import type { PaginatedResult } from "../../types/common";
import type {
  CustomerSummaryDto,
  CustomerAddressDto,
  CustomerGroupDto,
  CustomerFilters,
} from "../../types/customers";

export const customersApi = {
  list: (params?: CustomerFilters) => {
    const query: Record<string, unknown> = {};
    if (params?.search) query.Search = params.search;
    if (params?.page) query.Current = params.page;
    if (params?.pageSize) query.PageSize = params.pageSize;
    if (params?.type !== undefined) query.Type = params.type;

    return http.get<any>("/Admin/v1/Customer", query);
  },

  getById: (id: string) =>
    http.get<CustomerSummaryDto>(`/Admin/v1/Customer/${id}`),

  getAddresses: (customerId?: string) =>
    http.get<CustomerAddressDto[]>(
      "/Admin/v1/Customer/Addresses",
      customerId ? { customerId } : undefined,
    ),
};
