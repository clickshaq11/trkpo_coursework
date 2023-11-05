import { useForm, SubmitHandler } from 'react-hook-form';
import CircularProgress from '@mui/material/CircularProgress';
import styles from './login.module.scss';
import { LoginFields } from '@/types/auth';
import { FIELD_MAX_LENGTH, FIELD_MIN_LENGTH, FIELD_REGEX } from '../const';
import { StyledLink } from '@/components/Link';
import { StyledButton } from '@/components/Button';
import { useSignIn } from '@/api/hooks/auth/useSignIn';
import { useNavigate } from 'react-router-dom';

function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<LoginFields>();

  const navigate = useNavigate();

  const { mutate: onLoginClick, isLoading } = useSignIn(navigate);

  const onSubmit: SubmitHandler<LoginFields> = data => onLoginClick(data);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={styles.stack}>
      <h1>Авторизация</h1>
      <div className={styles.field}>
        <label htmlFor="login">Логин</label>
        <input
          className={styles.input}
          id="login"
          defaultValue=""
          {...register('login', {
            required: true,
            maxLength: FIELD_MAX_LENGTH,
            minLength: FIELD_MIN_LENGTH,
            pattern: FIELD_REGEX,
          })}
        />
        {errors.login && (
          <span className={styles.error}>
            Поле логина должно содержать от 8 до 50 символов и состоять из цифр
            и букв латинского алфавита
          </span>
        )}
      </div>

      <div className={styles.field}>
        <label htmlFor="password">Пароль</label>
        <input
          type="password"
          className={styles.input}
          id="password"
          defaultValue=""
          {...register('password', {
            required: true,
            maxLength: FIELD_MAX_LENGTH,
            minLength: FIELD_MIN_LENGTH,
            pattern: FIELD_REGEX,
          })}
        />
        {errors.password && (
          <span className={styles.error}>
            Поле пароля должно содержать от 8 до 50 символов и состоять из цифр
            и букв латинского алфавита
          </span>
        )}
      </div>

      <StyledButton
        type="submit"
        disabled={!isValid || isLoading}
        className={styles.button}
      >
        {isLoading ? <CircularProgress color="inherit" size="1rem" /> : 'Войти'}
      </StyledButton>
      <div className={styles.link_wrapper}>
        <StyledLink to="/register">Страница регистрации</StyledLink>
      </div>
    </form>
  );
}

export { Login };
