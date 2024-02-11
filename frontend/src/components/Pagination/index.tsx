import {
  Pagination,
  PaginationItem,
  PaginationRenderItemParams,
} from '@mui/material';
import { ProfileProps } from '../Profile';
import Dropdown from '@/components/Dropdown';
import { StyledButton } from '@/components/Button';
import { useState } from 'react';
import styles from './Pagination.module.scss';

function getIsDisabled(
  item: PaginationRenderItemParams,
  totalPages: number,
  currentPage: number,
): boolean {
  if (item.type === 'previous') {
    return item.disabled;
  }
  if (item.type === 'next') {
    return currentPage >= totalPages - 1;
  }
  if (item.page) {
    return item.page > totalPages;
  }
  return false;
}

function getIsSelected(item: PaginationRenderItemParams, currentPage: number) {
  if (item.type === 'page') {
    return item.page === currentPage + 1;
  }
  return false;
}

type CustomPaginationProps = Pick<ProfileProps, 'pagination' | 'totalPages'>;

function CustomPagination({ pagination, totalPages }: CustomPaginationProps) {
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>();

  return (
    <>
      <Dropdown anchorEl={anchorEl} onClose={() => setAnchorEl(null)}>
        {[10, 20, 30].map(number => (
          <StyledButton
            key={number}
            className={styles.button}
            variant="secondary"
            onClick={() => {
              setAnchorEl(null);
              pagination.setPaginationParams(prev => ({
                ...prev,
                size: number,
              }));
            }}
          >
            {number}
          </StyledButton>
        ))}
      </Dropdown>

      <Pagination
        sx={{ width: 600 }}
        count={10}
        siblingCount={10}
        page={pagination.paginationParams.page}
        onChange={(_, page: number) =>
          pagination.setPaginationParams(prev => ({ ...prev, page: page - 1 }))
        }
        renderItem={item => (
          <PaginationItem
            {...item}
            selected={getIsSelected(item, pagination.paginationParams.page)}
            disabled={getIsDisabled(
              item,
              totalPages,
              pagination.paginationParams.page,
            )}
          />
        )}
      />
      <StyledButton
        className={styles.button}
        variant="secondary"
        onClick={e => setAnchorEl(e.currentTarget)}
      >
        Показывать: {pagination.paginationParams.size} эл.
      </StyledButton>
    </>
  );
}

export { CustomPagination as Pagination };
