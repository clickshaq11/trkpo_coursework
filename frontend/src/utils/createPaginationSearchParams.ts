import { PaginationParams } from '@/types/pages';

interface SearchParams {
  [key: string]: string | number;
}

function createSearchParamsFromObject(params: SearchParams) {
  const searchParams = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    searchParams.append(key, value.toString());
  }
  return searchParams;
}

function createPaginationSearchParams(pagination: PaginationParams) {
  return createSearchParamsFromObject({
    page: pagination.page,
    size: pagination.size,
    sort: `${pagination.order},${pagination.type}`,
  });
}

export { createPaginationSearchParams };
