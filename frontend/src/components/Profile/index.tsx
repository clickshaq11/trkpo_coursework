import {
  EditProfileEntity,
  MyProfileEntity,
  ProfileEntity,
} from '@/types/profiles';
import styles from './Profile.module.scss';
import { StyledButton } from '../Button';
import { StyledLink } from '../Link';
import { PostEntity } from '@/types/posts';
import { Post } from '../Post';
import { Modal, DialogContent, CircularProgress } from '@mui/material';
import { PaginationParamsWithOneSetter } from '@/types/pages';
import { useState } from 'react';
import { EditProfileModal } from './EditProfileModal';
import SortButtons from './SortButtons';
import { Pagination } from '../Pagination';

type ProfileProps = {
  posts?: PostEntity[];
  pagination: PaginationParamsWithOneSetter;
  totalRows: number;
  totalPages: number;
} & (
  | {
      isOwnProfile: true;
      profileData?: MyProfileEntity;
      editProfileInfo?: (newProfileInfo: EditProfileEntity) => void;
      subscribe?: never;
    }
  | {
      isOwnProfile: false;
      profileData?: ProfileEntity;
      editProfileInfo?: never;
      subscribe?: (isSubscribed: boolean) => void;
    }
);

function Profile({
  isOwnProfile,
  profileData,
  posts,
  pagination,
  editProfileInfo,
  subscribe,
  totalPages,
}: ProfileProps) {
  const [isEditProfileModalOpen, setIsEditProfileModalOpen] =
    useState<boolean>(false);

  if (!profileData) {
    return <CircularProgress />;
  }

  return (
    <>
      <article className={styles.profile}>
        <header className={styles.header}>
          <h2 className={styles.login}>{profileData.login}</h2>
          {!isOwnProfile ? (
            <StyledButton
              onClick={() => subscribe?.(profileData.subscribed)}
              variant={profileData.subscribed ? 'tertiary' : 'primary'}
            >
              {profileData.subscribed ? 'Вы подписаны' : 'Подписаться'}
            </StyledButton>
          ) : (
            <>
              <Modal
                open={isEditProfileModalOpen}
                onClose={() => setIsEditProfileModalOpen(false)}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
              >
                <DialogContent>
                  <EditProfileModal
                    defaultValues={{
                      shortInfo: profileData.shortInfo,
                      password: '',
                    }}
                    onClose={() => setIsEditProfileModalOpen(false)}
                    save={editProfileInfo}
                  />
                </DialogContent>
              </Modal>
              <StyledButton onClick={() => setIsEditProfileModalOpen(true)}>
                Редактировать
              </StyledButton>
            </>
          )}
        </header>

        <p className={styles.info}>{profileData.shortInfo}</p>
        {isOwnProfile && (
          <div className={styles.subblock}>
            <h3>Подписки</h3>
            <div className={styles.subscriptions}>
              {profileData.subscriptions.map(sub => (
                <div className={styles.subscription} key={sub.id}>
                  <StyledLink
                    className={styles.subcription}
                    to={`/profiles/${sub.id}`}
                  >
                    {sub.login}
                  </StyledLink>
                </div>
              ))}
            </div>
          </div>
        )}
      </article>
      <div className={styles.feed}>
        {posts &&
          (posts.length === 0 ? (
            <span>
              {isOwnProfile ? 'У вас нет постов' : 'У пользователя нет постов'}
            </span>
          ) : (
            <>
              <div className={styles.pagination}>
                <Pagination pagination={pagination} totalPages={totalPages} />
                <SortButtons pagination={pagination} />
              </div>
              <div className={styles.posts}>
                {posts &&
                  posts?.map(post => (
                    <Post
                      {...post}
                      userId={!isOwnProfile ? profileData.id : undefined}
                      key={post.id}
                    />
                  ))}
              </div>
            </>
          ))}
      </div>
    </>
  );
}

export { Profile };
export type { ProfileProps };
