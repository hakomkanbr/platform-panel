export interface ApiResponse<T> {
  succeeded: boolean;
  data?: T;
  errors?: string[];
  error?: string;
  message?: string;
  statusCode?: number;
}

export interface PaginatedResult<T> {
  count: number;
  data: T[];
  page?: number;
  pageSize?: number;
  total?: number;
}

export interface ListParams {
  page?: number;
  pageSize?: number;
  search?: string;
  sortField?: string;
  sortOrder?: "asc" | "desc";
  [key: string]: unknown;
}

export interface KeyValue {
  key: string;
  value: string;
}

export interface TranslationField {
  languageCode: string;
  [key: string]: unknown;
}

export interface AuditInfo {
  createdBy?: string;
  createdAt?: string;
  updatedBy?: string;
  updatedAt?: string;
}

export type Id = string;
