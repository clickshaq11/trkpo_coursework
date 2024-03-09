import { useState, MouseEvent } from 'react';
import { Popper, ClickAwayListener } from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import styles from './Notifications.module.scss';
import { StyledLink } from '../Link';
import { useGetNotifications } from '@/api/hooks/misc/useGetNotifications';

function Notifications() {
  const [areNotificationsOpen, setAreNotificationsOpen] =
    useState<boolean>(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLDivElement>(null);

  const handleClick = (event: MouseEvent<HTMLDivElement>) => {
    setAnchorEl(event.currentTarget);
    setAreNotificationsOpen(prev => !prev);
  };

  const { data: notifications } = useGetNotifications();

  return (
    <div>
      <div
        className={styles.notification_btn}
        onClick={handleClick}
        aria-label='Уведомления'
      >
        <NotificationsIcon />
        <span>Уведомления</span>
      </div>
      <Popper open={areNotificationsOpen} anchorEl={anchorEl}>
        <ClickAwayListener onClickAway={() => setAreNotificationsOpen(false)}>
          <div className={styles.notifications} id='notifications-container'>
            {notifications ? (
              notifications?.map(notification => (
                <div className={styles.notification} key={notification.id}>
                  <span>Вас отметили.</span>
                  <StyledLink
                    to={`/posts/${notification.postId}`}
                    onClick={() => setAreNotificationsOpen(false)}
                  >
                    Перейти
                  </StyledLink>
                </div>
              ))
            ) : (
              <span>Уведомлений нет</span>
            )}
          </div>
        </ClickAwayListener>
      </Popper>
    </div>
  );
}

export default Notifications;
