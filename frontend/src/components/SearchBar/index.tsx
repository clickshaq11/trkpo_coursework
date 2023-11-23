import { useState, useRef } from 'react';
import SearchIcon from '@mui/icons-material/Search';
import { ClickAwayListener, Popper } from '@mui/material';
import styles from './SearchBar.module.scss';
import { StyledLink } from '../Link';
import { useSearchByLogin } from '@/api/hooks/misc/useSearchByLogin';
import { useDebounce } from '@/utils/useDebounce';
import { StyledButton } from '../Button';

function SearchBar() {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const debouncedSearchQuery = useDebounce(searchQuery, 100);
  const [areResultsOpen, setAreResultsOpen] = useState<boolean>(false);
  const [anchorEl, setAnchorEl] = useState<HTMLInputElement | null>(null);

  const ref = useRef<HTMLInputElement | null>(null);
  const {
    data: profiles,
    isLoading,
    refetch,
  } = useSearchByLogin(debouncedSearchQuery);

  const search = () => {
    setAnchorEl(ref.current);
    setAreResultsOpen(true)
    refetch();
  };

  return (
    <div className={styles.wrapper}
    >
      <input
        ref={ref}
        className={styles.search}
        placeholder="Введите логин для поиска..."
        value={searchQuery}
        onKeyDown={e => {
          if (e.key === 'Enter') {
            search()
          }
        }}
        onChange={e => setSearchQuery(e.target.value)}
      />
      <StyledButton
        className={styles.icon}
        disabled={!searchQuery}
        variant="secondary"
        onClick={search}
      >
        <SearchIcon fontSize="medium" />
      </StyledButton>
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
