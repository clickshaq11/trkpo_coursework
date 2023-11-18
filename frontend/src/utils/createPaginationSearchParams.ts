import { PaginationParams } from '@/types/pages';

interface SearchParams {
  [key: string]: string | number;
}

function createSearchParamsFromObject(
  params: SearchParams,
  needSort?: boolean,
) {
  const searchParams = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    searchParams.append(key, value.toString());
  }
  if (!needSort) {
    searchParams.delete('sort');
  }
  return searchParams;
}

function createPaginationSearchParams(
  pagination: PaginationParams,
  needSort?: boolean,
) {
  return createSearchParamsFromObject(
    {
      page: pagination.page,
      size: pagination.size,
      sort: `${pagination.type},${pagination.order}`,
    },
    needSort,
  );
}

export { createPaginationSearchParams };
