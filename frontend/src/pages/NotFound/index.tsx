import { StyledLink } from '@/components/Link';
import styles from './NotFound.module.scss';

function NotFound() {
  return (
    <div className={styles.notfound}>
      Извините, такой страницы нет.{' '}
      <StyledLink to="/">
        Нажмите сюда, чтобы перейти на главную страницу
      </StyledLink>
    </div>
  );
}

export { NotFound };
