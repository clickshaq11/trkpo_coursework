import { Navigate, Outlet } from 'react-router-dom';
import styles from './DefaultLayout.module.scss';
import { Header } from '../Header';

function DefaultLayout() {
  if (!localStorage.getItem('token')) {
    return <Navigate to="/login" replace />;
  }

  return (
    <>
      <Header />
      <main className={styles.main}>
        <Outlet />
      </main>
    </>
  );
}

export { DefaultLayout };
