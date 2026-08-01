export interface ApiResult<T> {
  succeeded: boolean;
  data: T;
  errors: string[] | null;
}

export interface PaginatedList<T> {
  count: number;
  data: T[];
}

export interface ListParams {
  search?: string;
  skip?: number;
  pageSize?: number;
  field?: string;
  order?: string;
}

export interface ApiErrorResponse {
  code: string;
  message: string;
}
