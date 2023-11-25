import { useState } from 'react';
import { Modal, DialogContent, CircularProgress } from '@mui/material';
import styles from './NewsFeed.module.scss';
import { Post } from '@/components/Post';
import { StyledButton } from '@/components/Button';
import { CreateNewPostModal } from './CreateNewPostModal';
import { useGetFeedPosts } from '@/api/hooks/feed/useGetFeedPosts';
import { useCreateNewPost } from '@/api/hooks/feed/useCreateNewPost';
import { useGetMyProfile } from '@/api/hooks/my-profile/useGetMyProfile';
import { StyledLink } from '@/components/Link';

function NewsFeed() {
  const [isCreateNewPostModalOpen, setIsCreateNewPostModalOpen] =
    useState<boolean>(false);

  const { mutate: createNewPost } = useCreateNewPost();

  const { data: posts, isSuccess: isGetPostsSuccess } = useGetFeedPosts();

  const { data: profile, isSuccess: isGetSubscriptionsSuccess } =
    useGetMyProfile();

  if (!isGetSubscriptionsSuccess || !isGetPostsSuccess) {
    return <CircularProgress />;
  }

  return (
    <div className={styles.content}>
      <StyledButton
        className={styles.button}
        onClick={() => setIsCreateNewPostModalOpen(true)}
      >
        Опубликовать пост
      </StyledButton>
      {profile.subscriptions.length > 0 && (
        <div className={styles.subblock}>
          <h3>Подписки</h3>
          <div className={styles.subscriptions}>
            {profile.subscriptions.map(sub => (
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
      <Modal
        open={isCreateNewPostModalOpen}
        onClose={() => setIsCreateNewPostModalOpen(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <DialogContent>
          <CreateNewPostModal
            onClose={() => setIsCreateNewPostModalOpen(false)}
            save={createNewPost}
          />
        </DialogContent>
      </Modal>
      <div className={styles.feed}>
        {posts?.length === 0 ? (
          <span>
            Вы не подписаны ни на одного пользователя. Подпишитесь, чтобы видеть
            его посты на этой странице
          </span>
        ) : (
          posts?.map(post => <Post key={post.id} {...post} />)
        )}
      </div>
    </div>
  );
}

export { NewsFeed };
