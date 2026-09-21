// Shared entity types for data returned by the RMHSA backend API.

export interface Blog {
  _id: string;
  title: string;
  desc: string;
  body: string;
  image?: string | null;
  createdAt: string;
  updatedAt?: string;
  [key: string]: unknown;
}

export interface Notification {
  _id: string;
  title: string;
  desc: string;
  body: string;
  createdAt: string;
  updatedAt?: string;
  [key: string]: unknown;
}

export interface Subscription {
  _id: string;
  email: string;
  createdAt?: string;
  [key: string]: unknown;
}

export interface PaginatedResponse<T> {
  items: T[];
  totalPages: number;
  currentPage?: number;
  total?: number;
  [key: string]: unknown;
}
