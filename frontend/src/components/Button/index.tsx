import { ButtonHTMLAttributes, forwardRef } from 'react';
import styles from './Button.module.scss';

type ButtonVariant = 'primary' | 'secondary' | 'tertiary';

type ButtonProps = {
  variant?: ButtonVariant;
} & ButtonHTMLAttributes<HTMLButtonElement>;

const mapVariantsToClassnames: Record<ButtonVariant, string> = {
  primary: 'primary',
  secondary: 'secondary',
  tertiary: 'tertiary',
};

const StyledButton = forwardRef<HTMLButtonElement, ButtonProps>(
  function StyledButton(props: ButtonProps, ref?) {
    return (
      <button
        ref={ref}
        {...props}
        className={`${styles.button} ${
          styles[mapVariantsToClassnames[props.variant || 'primary']]
        } ${props.className ? props.className : ''}`}
      ></button>
    );
  },
);

export { StyledButton };
