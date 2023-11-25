import { ClickAwayListener, Popper } from '@mui/material';
import { ReactNode } from 'react';
import styles from './Dropdown.module.scss';

type DropdownProps = {
  anchorEl: HTMLElement | (() => HTMLElement) | null | undefined;
  onClose: () => void;
  children: ReactNode;
  className?: string;
};

function Dropdown({ anchorEl, children, onClose, className }: DropdownProps) {
  return (
    <Popper id="basic-menu" anchorEl={anchorEl} open={Boolean(anchorEl)}>
      <ClickAwayListener onClickAway={onClose}>
        <div className={`${styles.back} ${className}`}>{children}</div>
      </ClickAwayListener>
    </Popper>
  );
}

export default Dropdown;
