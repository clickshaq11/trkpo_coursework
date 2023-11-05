import { Navigate, Outlet } from 'react-router-dom';
import styles from './DefaultLayout.module.scss';
import { Header } from '../Header';

function DefaultLayout() {
  //TODO: change the redirect condition localStorage.getItem('token')
  if (false) {
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
