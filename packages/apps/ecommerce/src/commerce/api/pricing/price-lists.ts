import * as http from "../http";
import type { PaginatedResult, ListParams } from "../../types/common";
import type {
  PriceListReadModel,
  PriceListFilters,
  CreatePriceListCommand,
  UpdatePriceListRequest,
  AddPriceListTranslationBody,
  UpdatePriceListTranslationBody,
  AssignCustomerGroupBody,
  AssignChannelBody,
  AssignRegionBody,
  AssignStoreBody,
  UpsertMetadataBody,
} from "../../types/pricing";

export const priceListsApi = {
  list: (params?: PriceListFilters) =>
    http.get<PaginatedResult<PriceListReadModel>>("/Admin/v1/PriceLists", params),

  getById: (id: string) => http.get<PriceListReadModel>(`/Admin/v1/PriceLists/${id}`),

  create: (body: CreatePriceListCommand) => http.post<PriceListReadModel>("/Admin/v1/PriceLists", body),

  update: (id: string, body: UpdatePriceListRequest) =>
    http.put<PriceListReadModel>(`/Admin/v1/PriceLists/${id}`, body),

  delete: (id: string) => http.del<void>(`/Admin/v1/PriceLists/${id}`),

  publish: (id: string) => http.put<void>(`/Admin/v1/PriceLists/${id}/publish`),

  activate: (id: string) => http.put<void>(`/Admin/v1/PriceLists/${id}/activate`),

  deactivate: (id: string) => http.put<void>(`/Admin/v1/PriceLists/${id}/deactivate`),

  archive: (id: string) => http.put<void>(`/Admin/v1/PriceLists/${id}/archive`),

  addTranslation: (id: string, body: AddPriceListTranslationBody) =>
    http.put<PriceListReadModel>(`/Admin/v1/PriceLists/${id}/translations`, body),

  updateTranslation: (id: string, languageId: string, body: UpdatePriceListTranslationBody) =>
    http.put<PriceListReadModel>(`/Admin/v1/PriceLists/${id}/translations/${languageId}`, body),

  assignCustomerGroup: (id: string, body: AssignCustomerGroupBody) =>
    http.put<void>(`/Admin/v1/PriceLists/${id}/customer-groups`, body),

  removeCustomerGroup: (id: string, customerGroupId: string) =>
    http.del<void>(`/Admin/v1/PriceLists/${id}/customer-groups/${customerGroupId}`),

  assignChannel: (id: string, body: AssignChannelBody) =>
    http.put<void>(`/Admin/v1/PriceLists/${id}/channels`, body),

  removeChannel: (id: string, channelId: string) =>
    http.del<void>(`/Admin/v1/PriceLists/${id}/channels/${channelId}`),

  assignRegion: (id: string, body: AssignRegionBody) =>
    http.put<void>(`/Admin/v1/PriceLists/${id}/regions`, body),

  removeRegion: (id: string, regionId: string) =>
    http.del<void>(`/Admin/v1/PriceLists/${id}/regions/${regionId}`),

  assignStore: (id: string, body: AssignStoreBody) =>
    http.put<void>(`/Admin/v1/PriceLists/${id}/stores`, body),

  removeStore: (id: string, storeId: string) =>
    http.del<void>(`/Admin/v1/PriceLists/${id}/stores/${storeId}`),

  upsertMetadata: (id: string, body: UpsertMetadataBody) =>
    http.put<void>(`/Admin/v1/PriceLists/${id}/metadata`, body),

  removeMetadata: (id: string, key: string) =>
    http.del<void>(`/Admin/v1/PriceLists/${id}/metadata/${key}`),
};