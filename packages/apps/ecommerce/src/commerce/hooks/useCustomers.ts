import { useQuery } from "@tanstack/react-query";
import { customersApi } from "../api/customers/customers";
import { useCommerce } from "../context/CommerceContext";
import {
  EnumCustomerType,
  type CustomerFilters,
  type CustomerSummaryDto,
} from "../types/customers";
import type { PaginatedResult } from "../types/common";

const DEFAULT_MOCK_CUSTOMERS: CustomerSummaryDto[] = [];

function mapCustomer(c: any): CustomerSummaryDto {
  return {
    id: c.id || c.Id,
    name: c.name || c.Name || "",
    sureName:
      c.sureName || c.surename || c.Surename || c.SureName || c.surname || "",
    email: c.email || c.Email || "",
    phoneNumber: c.phoneNumber || c.PhoneNumber || "",
    type: c.type ?? c.Type ?? EnumCustomerType.Individual,
    taxOffice: c.taxOffice ?? c.TaxOffice,
    taxNumber: c.taxNumber ?? c.TaxNumber,
    unvan: c.unvan ?? c.Unvan,
    ordersCount: c.ordersCount ?? c.OrdersCount ?? 0,
    totalSpent: c.totalSpent ?? c.TotalSpent ?? 0,
    createdAt: c.createdAt || c.CreatedAt || new Date().toISOString(),
  };
}

export function useCustomers(params: CustomerFilters) {
  const { projectId } = useCommerce();
  return useQuery({
    queryKey: ["customers", "list", projectId, params],
    queryFn: async (): Promise<PaginatedResult<CustomerSummaryDto>> => {
      try {
        const res = await customersApi.list(params);
        if (res !== undefined && res !== null) {
          const items = Array.isArray(res)
            ? res
            : Array.isArray(res.items)
              ? res.items
              : Array.isArray(res.data)
                ? res.data
                : [];

          const count =
            typeof res.totalCount === "number"
              ? res.totalCount
              : typeof res.count === "number"
                ? res.count
                : items.length;

          return {
            count,
            data: items.map(mapCustomer),
          };
        }
      } catch (err) {
        console.warn(
          "Failed to fetch customers from API, checking fallback:",
          err,
        );
      }

      // Offline dev fallback only if backend unreachable
      let filtered = [...DEFAULT_MOCK_CUSTOMERS];
      if (params.search) {
        const q = params.search.toLowerCase();
        filtered = filtered.filter(
          (c) =>
            c.name.toLowerCase().includes(q) ||
            c.sureName.toLowerCase().includes(q) ||
            c.email.toLowerCase().includes(q) ||
            c.phoneNumber.includes(q),
        );
      }
      if (params.type) {
        filtered = filtered.filter((c) => c.type === params.type);
      }

      return {
        count: filtered.length,
        data: filtered,
      };
    },
    enabled: !!projectId,
    staleTime: 15_000,
  });
}
