import styles from './SortButtons.module.scss';
import { StyledButton } from '@/components/Button';
import Dropdown from '@/components/Dropdown';
import { PaginationParamsWithOneSetter } from '@/types/pages';
import { useState } from 'react';

type SortButtonsProps = {
  pagination: PaginationParamsWithOneSetter;
};

function SortButtons({ pagination }: SortButtonsProps) {
  const [orderTypeAnchorEl, setOrderTypeAnchorEl] =
    useState<HTMLButtonElement | null>();
  const [orderAnchorEl, setOrderAnchorEl] =
    useState<HTMLButtonElement | null>();

  return (
    <>
      <StyledButton
        className={styles.btn}
        variant="secondary"
        onClick={e => setOrderTypeAnchorEl(e.currentTarget)}
      >
        Тип сортировки
      </StyledButton>
      <Dropdown
        anchorEl={orderTypeAnchorEl}
        onClose={() => setOrderTypeAnchorEl(null)}
      >
        <StyledButton
          className={styles.btn}
          variant="secondary"
          onClick={() => {
            setOrderTypeAnchorEl(null);
            pagination.setPaginationParams(prev => ({
              ...prev,
              type: 'popularity',
            }));
          }}
        >
          По популярности
        </StyledButton>
        <StyledButton
          className={styles.btn}
          variant="secondary"
          onClick={() => {
            setOrderTypeAnchorEl(null);
            pagination.setPaginationParams(prev => ({
              ...prev,
              type: 'date',
            }));
          }}
        >
          По дате
        </StyledButton>
      </Dropdown>
      <StyledButton
        className={styles.btn}
        variant="secondary"
        onClick={e => setOrderAnchorEl(e.currentTarget)}
      >
        Сортировка по
      </StyledButton>
      <Dropdown anchorEl={orderAnchorEl} onClose={() => setOrderAnchorEl(null)}>
        <StyledButton
          className={styles.btn}
          variant="secondary"
          onClick={() => {
            setOrderAnchorEl(null);
            pagination.setPaginationParams(prev => ({
              ...prev,
              order: 'desc',
            }));
          }}
        >
          По убыванию
        </StyledButton>
        <StyledButton
          className={styles.btn}
          variant="secondary"
          onClick={() => {
            setOrderAnchorEl(null);
            pagination.setPaginationParams(prev => ({
              ...prev,
              order: 'asc',
            }));
          }}
        >
          По возрастанию
        </StyledButton>
      </Dropdown>
    </>
  );
}

export default SortButtons;
