import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ordersApi } from "../api/orders/orders";
import { useCommerce } from "../context/CommerceContext";
import {
  EnumOrderStatus,
  type OrderDetailDto,
  type OrderFilters,
  type OrderSummaryDto,
} from "../types/orders";
import type { PaginatedResult } from "../types/common";

const DEFAULT_MOCK_ORDERS: OrderDetailDto[] = [
  {
    id: "f47ac10b-58cc-4372-a567-0e02b2c3d479",
    code: "ORD-742918",
    dateTime: new Date(Date.now() - 1000 * 60 * 35).toISOString(),
    status: EnumOrderStatus.Processing,
    grandTotal: 1850.0,
    subtotal: 1750.0,
    shippingFee: 100.0,
    discountAmount: 0,
    taxAmount: 0,
    currency: "TRY",
    note: "يرجى الاتصال قبل التوصيل بنصف ساعة",
    customerName: "أحمد العلي",
    customerPhone: "+90 534 112 3344",
    customerEmail: "ahmed.ali@example.com",
    paymentMethod: "الدفع عند الاستلام (COD)",
    orderAddress: {
      fullName: "أحمد العلي",
      phoneNumber: "+90 534 112 3344",
      city: "إسطنبول",
      addressLine1: "الفاتح - شارع فوزي باشا - بناء 14 شقة 3",
      country: "تركيا",
    },
    items: [
      {
        id: "item-1",
        productId: "prod-1",
        productName: "قميص كاجوال كتان فاخر",
        variantName: "مقاس L / أزرق",
        quantity: 2,
        unitPrice: 650.0,
        totalPrice: 1300.0,
        currency: "TRY",
        image: "/assets/images/logo-icon.png",
      },
      {
        id: "item-2",
        productId: "prod-2",
        productName: "بنطال جينز عصري",
        variantName: "مقاس 32 / كحلي",
        quantity: 1,
        unitPrice: 450.0,
        totalPrice: 450.0,
        currency: "TRY",
        image: "/assets/images/logo-icon.png",
      },
    ],
  },
  {
    id: "e38bd20a-47bb-4261-9456-9d91a1b2c368",
    code: "ORD-851230",
    dateTime: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
    status: EnumOrderStatus.InCargo,
    grandTotal: 3200.0,
    subtotal: 3200.0,
    shippingFee: 0,
    discountAmount: 0,
    taxAmount: 0,
    currency: "TRY",
    note: "",
    customerName: "سارة محمود",
    customerPhone: "+90 552 987 6543",
    customerEmail: "sara.m@example.com",
    paymentMethod: "بطاقة بنكية (Credit Card)",
    orderAddress: {
      fullName: "سارة محمود",
      phoneNumber: "+90 552 987 6543",
      city: "أنقرة",
      addressLine1: "جانكايا - شارع أتاتورك - بناء 88",
      country: "تركيا",
    },
    items: [
      {
        id: "item-3",
        productId: "prod-3",
        productName: "فستان سهرة حرير كلاسيكي",
        variantName: "مقاس M / أسود",
        quantity: 1,
        unitPrice: 3200.0,
        totalPrice: 3200.0,
        currency: "TRY",
        image: "/assets/images/logo-icon.png",
      },
    ],
  },
  {
    id: "d27ac09a-36aa-4150-8345-8c8090a1b257",
    code: "ORD-910442",
    dateTime: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    status: EnumOrderStatus.Delivered,
    grandTotal: 920.0,
    subtotal: 870.0,
    shippingFee: 50.0,
    discountAmount: 0,
    taxAmount: 0,
    currency: "TRY",
    note: "اترك الطلب عند الباب إن لم أكن متواجداً",
    customerName: "محمد الكردي",
    customerPhone: "+90 531 222 3311",
    customerEmail: "mohammed.k@example.com",
    paymentMethod: "الدفع عند الاستلام (COD)",
    orderAddress: {
      fullName: "محمد الكردي",
      phoneNumber: "+90 531 222 3311",
      city: "بورصة",
      addressLine1: "نيلوفر - مجمع الياسمين - شقة 12",
      country: "تركيا",
    },
    items: [
      {
        id: "item-4",
        productId: "prod-4",
        productName: "حذاء جلدي رسمي",
        variantName: "مقاس 42 / بني",
        quantity: 1,
        unitPrice: 870.0,
        totalPrice: 870.0,
        currency: "TRY",
        image: "/assets/images/logo-icon.png",
      },
    ],
  },
  {
    id: "c16ab989-2599-4049-7234-7b708990a146",
    code: "ORD-623105",
    dateTime: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
    status: EnumOrderStatus.AwaitingApproval,
    grandTotal: 1450.0,
    subtotal: 1450.0,
    shippingFee: 0,
    discountAmount: 0,
    taxAmount: 0,
    currency: "TRY",
    note: "طلب فوري عبر واتساب",
    customerName: "خالد المنصور",
    customerPhone: "+90 539 444 8877",
    customerEmail: "khaled.m@example.com",
    paymentMethod: "واتساب / الدفع عند الاستلام",
    orderAddress: {
      fullName: "خالد المنصور",
      phoneNumber: "+90 539 444 8877",
      city: "إسطنبول",
      addressLine1: "باشاك شهير - مجمع بهجة شاهير - بلوك C",
      country: "تركيا",
    },
    items: [
      {
        id: "item-5",
        productId: "prod-5",
        productName: "حقيبة ظهر للسفر مقاومة للماء",
        variantName: "رمادي داكن",
        quantity: 1,
        unitPrice: 1450.0,
        totalPrice: 1450.0,
        currency: "TRY",
        image: "/assets/images/logo-icon.png",
      },
    ],
  },
];

function getStoredOrders(projectId: string): OrderDetailDto[] {
  if (typeof window === "undefined") return DEFAULT_MOCK_ORDERS;
  const key = `s2s_orders_${projectId}`;
  try {
    const raw = localStorage.getItem(key);
    if (!raw) {
      localStorage.setItem(key, JSON.stringify(DEFAULT_MOCK_ORDERS));
      return DEFAULT_MOCK_ORDERS;
    }
    return JSON.parse(raw);
  } catch {
    return DEFAULT_MOCK_ORDERS;
  }
}

function saveStoredOrders(projectId: string, orders: OrderDetailDto[]) {
  if (typeof window === "undefined") return;
  const key = `s2s_orders_${projectId}`;
  try {
    localStorage.setItem(key, JSON.stringify(orders));
  } catch {}
}

export function useOrders(params: OrderFilters) {
  const { projectId } = useCommerce();
  return useQuery({
    queryKey: ["orders", "list", projectId, params],
    queryFn: async (): Promise<PaginatedResult<OrderSummaryDto>> => {
      try {
        const res = await ordersApi.list(params);
        if (res) {
          return res;
        }
      } catch (err) {
        // Fallback to local storage persistence
      }

      const all = getStoredOrders(projectId || "default");
      let filtered = [...all];

      if (params.search) {
        const q = params.search.toLowerCase();
        filtered = filtered.filter(
          (o) =>
            o.code.toLowerCase().includes(q) ||
            (o.customerName && o.customerName.toLowerCase().includes(q)) ||
            (o.customerPhone && o.customerPhone.includes(q)),
        );
      }

      if (params.status !== undefined && params.status !== null) {
        filtered = filtered.filter((o) => o.status === params.status);
      }

      const summaryList: OrderSummaryDto[] = filtered.map((o) => {
        const customer =
          o.customerName ||
          (o.orderAddress?.recipientInformation
            ? `${o.orderAddress.recipientInformation.firstName || ""} ${o.orderAddress.recipientInformation.lastName || ""}`.trim()
            : o.orderAddress?.fullName) ||
          "عميل";

        const phoneNumber =
          o.customerPhone ||
          o.orderAddress?.recipientInformation?.phoneNumber ||
          o.orderAddress?.phoneNumber ||
          "";

        return {
          id: o.id,
          code: o.code,
          status: o.status,
          grandTotal: o.grandTotal,
          currency: o.currency || "TRY",
          dateTime: o.dateTime,
          customer,
          phoneNumber,
          itemsCount: o.items?.reduce((sum, item) => sum + item.quantity, 0) || 0,
          paymentMethod: o.paymentMethod,
        };
      });

      return {
        count: summaryList.length,
        data: summaryList,
      };
    },
    enabled: !!projectId,
    staleTime: 15_000,
  });
}

export function useOrderDetail(id: string | null) {
  const { projectId } = useCommerce();
  return useQuery({
    queryKey: ["orders", "detail", projectId, id],
    queryFn: async (): Promise<OrderDetailDto | null> => {
      if (!id) return null;
      try {
        const res = await ordersApi.getById(id);
        if (res) return res;
      } catch (err) {}

      const all = getStoredOrders(projectId || "default");
      const found = all.find((o) => o.id === id || o.code === id);
      return found || null;
    },
    enabled: !!projectId && !!id,
  });
}

export function useUpdateOrderStatus() {
  const queryClient = useQueryClient();
  const { projectId } = useCommerce();

  return useMutation({
    mutationFn: async ({
      id,
      status,
    }: {
      id: string;
      status: EnumOrderStatus;
    }) => {
      try {
        await ordersApi.setStatus(id, status);
      } catch (err) {
        // Fallback: update in localStorage
        const all = getStoredOrders(projectId || "default");
        const idx = all.findIndex((o) => o.id === id || o.code === id);
        if (idx !== -1) {
          all[idx] = { ...all[idx], status };
          saveStoredOrders(projectId || "default", all);
        }
      }
      return { id, status };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
  });
}
