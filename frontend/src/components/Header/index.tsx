import styles from './Header.module.scss';
import FeedIcon from '@mui/icons-material/Feed';
import Person2Icon from '@mui/icons-material/Person2';
import SearchBar from '../SearchBar';
import { StyledLink } from '../Link';
import Notifications from '../Notifications';

function Header() {
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
      </div>
    </header>
  );
}

export { Header };
