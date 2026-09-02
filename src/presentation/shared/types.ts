// Shared types for presentation layer

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface PaginationParams {
  page: number;
  limit: number;
}

export interface ListResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
}
