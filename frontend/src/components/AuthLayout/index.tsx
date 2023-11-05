import { Outlet } from 'react-router-dom';
import styles from './AuthLayout.module.scss';

function AuthLayout() {
  return (
    <main className={styles.main}>
      <Outlet />
    </main>
  );
}

export { AuthLayout };
