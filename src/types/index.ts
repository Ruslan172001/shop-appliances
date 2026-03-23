export * from "./product.interface";
export * from "./cart.interface";
export * from "./wishlist.interface";
export * from "./order.interface";
export * from "./user.interface";
export * from "./review.interface";
export * from "./promo.interface";
export * from "./analytics.interface";

// Общие утилитарные типы
export type ApiResponse<T> = {
  success: boolean;
  data?: T;
  error?: string;
};

export type PaginationParams = {
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
};

export type PaginationResult<T> = {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

export type SortOption = {
  label: string;
  value: string;
  field: string;
  order: "asc" | "desc";
};

export type FilterOption = {
  label: string;
  value: string | boolean | number;
};
