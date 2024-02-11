import styles from './Header.module.scss';
import FeedIcon from '@mui/icons-material/Feed';
import Person2Icon from '@mui/icons-material/Person2';
import SearchBar from '../SearchBar';
import { StyledLink } from '../Link';
import Notifications from '../Notifications';
import LogoutIcon from '@mui/icons-material/Logout';
import { StyledButton } from '../Button';
import { useNavigate } from 'react-router-dom';

function Header() {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <header className={styles.header}>
      <Notifications />
      <SearchBar />
      <div className={styles.links}>
        <StyledLink className={styles.link} to="/">
          <FeedIcon /> <span>Новости</span>
        </StyledLink>
        <StyledLink className={styles.link} to="/me">
          <Person2Icon /> <span>Мой профиль</span>
        </StyledLink>
        <StyledButton variant="secondary" onClick={logout}>
          <LogoutIcon />
        </StyledButton>
      </div>
    </header>
  );
}

export { Header };
