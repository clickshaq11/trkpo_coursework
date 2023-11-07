import { useState, ChangeEvent } from 'react';
import SearchIcon from '@mui/icons-material/Search';
import { ClickAwayListener, Popper } from '@mui/material';
import styles from './SearchBar.module.scss';
import { StyledLink } from '../Link';
import { useSearchByLogin } from '@/api/hooks/misc/useSearchByLogin';
import { useDebounce } from '@/utils/useDebounce';

function SearchBar() {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const debouncedSearchQuery = useDebounce(searchQuery, 100);
  const [areResultsOpen, setAreResultsOpen] = useState<boolean>(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const search = (event: ChangeEvent<HTMLInputElement>) => {
    const currentQuery = event.target.value;
    setSearchQuery(currentQuery);
    setAnchorEl(event.currentTarget);
    setAreResultsOpen(Boolean(currentQuery));
  };

  const handleInputClick = () => {
    if (searchQuery) {
      setAreResultsOpen(true);
    }
  };

  const { data: profiles, isLoading } = useSearchByLogin(debouncedSearchQuery);

  return (
    <div className={styles.wrapper}>
      <input
        className={styles.search}
        placeholder="Введите логин для поиска..."
        value={searchQuery}
        onChange={search}
        onClick={handleInputClick}
      />
      <SearchIcon fontSize="medium" className={styles.icon} />
      <Popper open={areResultsOpen} anchorEl={anchorEl}>
        <ClickAwayListener onClickAway={() => setAreResultsOpen(false)}>
          <div className={styles.results}>
            {profiles && !isLoading ? (
              profiles?.map(profile => (
                <div className={styles.result} key={profile.id}>
                  <div className={styles.link_wrapper}>
                    <StyledLink
                      to={`/profiles/${profile.id}`}
                      onClick={() => setAreResultsOpen(false)}
                    >
                      {profile.login}
                    </StyledLink>
                  </div>
                  <span>{profile.shortInfo}</span>
                </div>
              ))
            ) : (
              <span>Ничего не найдено</span>
            )}
          </div>
        </ClickAwayListener>
      </Popper>
    </div>
  );
}

export default SearchBar;
