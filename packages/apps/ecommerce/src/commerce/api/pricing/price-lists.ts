import * as http from "../http";
import type { PaginatedResult, ListParams, KeyValue, TranslationField } from "../../types/common";
import type {
  PriceList,
  PriceListChannel,
  PriceListCustomerGroup,
  PriceListRegion,
  PriceListStore,
} from "../../types/pricing";

export interface PriceListFilters extends ListParams {
  status?: string;
  currencyId?: string;
}

export interface PriceListUpsertBody {
  code?: string;
  name: string;
  description?: string;
  taxMode?: number;
  currencyId?: string;
  priority?: number;
  isDefault?: boolean;
  effectiveFrom?: string;
  effectiveTo?: string;
  metadata?: KeyValue[];
}

export const priceListsApi = {
  list: (params?: PriceListFilters) =>
    http.get<PaginatedResult<PriceList> | PriceList[]>("/Admin/PriceLists", params),

  getById: (id: string) => http.get<PriceList>(`/Admin/PriceLists/${id}`),

  create: (body: PriceListUpsertBody) => http.post<PriceList>("/Admin/PriceLists", body),

  update: (id: string, body: Partial<PriceListUpsertBody>) => http.put<PriceList>(`/Admin/PriceLists/${id}`, body),

  delete: (id: string) => http.del<void>(`/Admin/PriceLists/${id}`),

  getChannels: (id: string) => http.get<PriceListChannel[]>(`/Admin/PriceLists/${id}/channels`),

  addChannel: (id: string, body: Partial<PriceListChannel>) =>
    http.post<PriceListChannel>(`/Admin/PriceLists/${id}/channels`, body),

  updateChannel: (id: string, channelId: string, body: Partial<PriceListChannel>) =>
    http.put<PriceListChannel>(`/Admin/PriceLists/${id}/channels/${channelId}`, body),

  deleteChannel: (id: string, channelId: string) => http.del<void>(`/Admin/PriceLists/${id}/channels/${channelId}`),

  getCustomerGroups: (id: string) => http.get<PriceListCustomerGroup[]>(`/Admin/PriceLists/${id}/customer-groups`),

  addCustomerGroup: (id: string, body: Partial<PriceListCustomerGroup>) =>
    http.post<PriceListCustomerGroup>(`/Admin/PriceLists/${id}/customer-groups`, body),

  deleteCustomerGroup: (id: string, customerGroupId: string) =>
    http.del<void>(`/Admin/PriceLists/${id}/customer-groups/${customerGroupId}`),

  getRegions: (id: string) => http.get<PriceListRegion[]>(`/Admin/PriceLists/${id}/regions`),

  addRegion: (id: string, body: Partial<PriceListRegion>) =>
    http.post<PriceListRegion>(`/Admin/PriceLists/${id}/regions`, body),

  deleteRegion: (id: string, regionId: string) => http.del<void>(`/Admin/PriceLists/${id}/regions/${regionId}`),

  getStores: (id: string) => http.get<PriceListStore[]>(`/Admin/PriceLists/${id}/stores`),

  addStore: (id: string, body: Partial<PriceListStore>) =>
    http.post<PriceListStore>(`/Admin/PriceLists/${id}/stores`, body),

  deleteStore: (id: string, storeId: string) => http.del<void>(`/Admin/PriceLists/${id}/stores/${storeId}`),

  setMetadata: (id: string, metadata: KeyValue[]) => http.put<void>(`/Admin/PriceLists/${id}/metadata`, { metadata }),

  setTranslations: (id: string, translations: TranslationField[]) =>
    http.put<void>(`/Admin/PriceLists/${id}/translations`, { translations }),
};
