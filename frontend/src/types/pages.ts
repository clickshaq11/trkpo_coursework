import { Dispatch, SetStateAction } from 'react';

type Order = 'asc' | 'desc';
type OrderType = 'likeCounter' | 'createdAt';

type PaginationParams = {
  page: number;
  size: number;
  order: Order;
  type: OrderType;
};

type PaginationParamsWithOneSetter = {
  paginationParams: PaginationParams;
  setPaginationParams: Dispatch<SetStateAction<PaginationParams>>;
};

type PaginationResponse<T> = {
  totalElements: number;
  totalPages: number;
  content: T;
};

export type {
  Order,
  PaginationParams,
  PaginationParamsWithOneSetter,
  PaginationResponse,
};
