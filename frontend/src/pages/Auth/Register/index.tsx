import { useNavigate } from 'react-router-dom';
import { SubmitHandler, useForm } from 'react-hook-form';
import styles from './register.module.scss';
import {
  FIELD_MAX_LENGTH,
  FIELD_MIN_LENGTH,
  FIELD_REGEX,
  SHORT_INFO_MAX_LENGTH,
  SHORT_INFO_MIN_LENGTH
} from '../const';
import { RegisterFields } from '@/types/auth';
import { StyledLink } from '@/components/Link';
import { StyledButton } from '@/components/Button';
import { useSignup } from '@/api/hooks/auth/useSignup';
import CircularProgress from '@mui/material/CircularProgress';

function Register() {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid }
  } = useForm<RegisterFields>({ mode: 'onTouched' });

  const navigate = useNavigate();

  const { mutate: onSignUp, isLoading, isError, error } = useSignup(navigate);

  const onSubmit: SubmitHandler<RegisterFields> = data => onSignUp(data);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={styles.stack}>
      <h1>Регистрация</h1>
      <div className={styles.field}>
        <label htmlFor='login'>Логин</label>
        <input
          className={styles.input}
          autoComplete='username'
          id='login'
          defaultValue=''
          {...register('login', {
            required: true,
            maxLength: FIELD_MAX_LENGTH,
            minLength: FIELD_MIN_LENGTH,
            pattern: FIELD_REGEX
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
        <label htmlFor='password'>Пароль</label>
        <input
          autoComplete='new-password'
          type='password'
          className={styles.input}
          id='password'
          defaultValue=''
          {...register('password', {
            required: true,
            maxLength: FIELD_MAX_LENGTH,
            minLength: FIELD_MIN_LENGTH,
            pattern: FIELD_REGEX
          })}
        />
        {errors.password && (
          <span className={styles.error}>
            Поле пароля должно содержать от 8 до 50 символов и состоять из цифр
            и букв латинского алфавита
          </span>
        )}
      </div>

      <div className={styles.field}>
        <label htmlFor='repeat-password'>Повторите пароль</label>
        <input
          type='password'
          autoComplete='new-password'
          className={styles.input}
          id='repeat-password'
          defaultValue=''
          {...register('repeatPassword', {
            required: true,
            maxLength: FIELD_MAX_LENGTH,
            minLength: FIELD_MIN_LENGTH,
            pattern: FIELD_REGEX,
            validate: {
              passwordsMatch: (value, formValues) =>
                formValues.password === value
            }
          })}
        />
        {errors.repeatPassword?.type === 'passwordsMatch' && (
          <span className={styles.error}>'Пароли не совпадают'</span>
        )}
      </div>

      <div className={`${styles.field} ${styles.multiline}`}>
        <label htmlFor='short-info'>Краткая информация</label>
        <textarea
          className={styles.input}
          id='short-info'
          defaultValue=''
          {...register('shortInfo', {
            required: true,
            maxLength: SHORT_INFO_MAX_LENGTH,
            minLength: SHORT_INFO_MIN_LENGTH
          })}
        />
        {errors.shortInfo && (
          <span className={`${styles.error} ${styles.multiline_error}`}>
            Поле краткой информации должно содержать от 1 до 250 символов
          </span>
        )}
        {isError && (
          <span className={styles.error} role='alert'>{error.response?.data.message}</span>
        )}
      </div>

      <StyledButton type='submit' disabled={!isValid} className={styles.button}>
        {isLoading ? <CircularProgress color='inherit' size='1rem' /> : 'Войти'}
      </StyledButton>
      <div className='link_wrapper'>
        <StyledLink to='/login'>Страница авторизации</StyledLink>
      </div>
    </form>
  );
}

export { Register };
