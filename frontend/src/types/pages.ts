import { Dispatch, SetStateAction } from "react";

type Order = 'asc' | 'desc';
type OrderType = 'popularity' | 'date';

type PaginationParams = {
  page: number;
  size: number;
  order: Order;
  type: OrderType;
};

type PaginationParamsWithOneSetter = {
  paginationParams: PaginationParams;
  setPaginationParams: Dispatch<SetStateAction<PaginationParams>>
};

export type { Order, PaginationParams, PaginationParamsWithOneSetter };
