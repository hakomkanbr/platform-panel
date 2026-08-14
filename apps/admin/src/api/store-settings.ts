import { get, post, put } from "@repo/apps-ecommerce/commerce/api/http";

export interface StoreSettingsDto {
  id: string;
  tenantId: string;
  projectId: string;
  storeId: string;
  whatsAppOrdersEnabled: boolean;
  whatsAppOrderNumber: string | null;
  defaultLanguageId: string | null;
  defaultCurrencyId: string | null;
  phone: string | null;
  address: string | null;
  city: string | null;
  country: string | null;
  postalCode: string | null;
  currencyCode: string | null;
  createdAt: string;
  createdBy: string;
  modifiedAt: string | null;
  modifiedBy: string | null;
}

export interface StoreDto {
  id: string;
  tenantId: string;
  projectId: string;
  name: string;
  slug: string;
  description: string | null;
  logoMediaId: string | null;
  status: number;
  settings: StoreSettingsDto | null;
}

export interface CreateStoreRequest {
  name: string;
  slug: string;
  description?: string | null;
  logoMediaId?: string | null;
  projectId?: string | null;
  whatsAppOrdersEnabled?: boolean;
  whatsAppOrderNumber?: string | null;
  defaultLanguageId?: string | null;
  defaultCurrencyId?: string | null;
  phone?: string | null;
  address?: string | null;
  city?: string | null;
  country?: string | null;
  postalCode?: string | null;
  currencyCode?: string | null;
}

export interface UpdateStoreSettingsRequest {
  whatsAppOrdersEnabled?: boolean;
  whatsAppOrderNumber?: string | null;
  defaultLanguageId?: string | null;
  defaultCurrencyId?: string | null;
  phone?: string | null;
  address?: string | null;
  city?: string | null;
  country?: string | null;
  postalCode?: string | null;
  currencyCode?: string | null;
}

const headersFor = (projectId: string) => ({ "X-Project-Id": projectId });

export const storeSettingsApi = {
  async getStoreByProject(projectId: string): Promise<StoreDto | null> {
    try {
      const store = await get<StoreDto>(
        `/Admin/v1/Stores/by-project/${projectId}`,
        undefined,
        { headers: headersFor(projectId) },
      );
      return store;
    } catch {
      return null;
    }
  },

  async getStoreById(storeId: string, projectId: string): Promise<StoreDto | null> {
    try {
      const store = await get<StoreDto>(
        `/Admin/v1/Stores/${storeId}`,
        undefined,
        { headers: headersFor(projectId) },
      );
      return store;
    } catch {
      return null;
    }
  },

  async createStore(
    projectId: string,
    request: CreateStoreRequest,
  ): Promise<StoreDto> {
    return post<StoreDto>(
      "/Admin/v1/Stores",
      { ...request, projectId },
      { headers: headersFor(projectId) },
    );
  },

  async updateSettings(
    storeId: string,
    projectId: string,
    request: UpdateStoreSettingsRequest,
  ): Promise<StoreSettingsDto> {
    return put<StoreSettingsDto>(
      `/Admin/v1/Stores/${storeId}/StoreSettings`,
      request,
      { headers: headersFor(projectId) },
    );
  },
};