import { useState } from 'react';
import { Modal, DialogContent } from '@mui/material';
import styles from './ControlButtons.module.scss';
import { useLikePost } from '@/api/hooks/shared/useLikePost';
import { PostPageEntity } from '@/types/posts';
import { StyledButton } from '@/components/Button';
import Dropdown from '@/components/Dropdown';
import FavoriteIcon from '@mui/icons-material/Favorite';
import SettingsIcon from '@mui/icons-material/Settings';
import { EditPostModalContent } from '../EditPostModalContent';
import { useNavigate } from 'react-router-dom';
import { useDeletePost } from '@/api/hooks/post/useDeletePost';
import { useUpdatePost } from '@/api/hooks/post/useUpdatePost';

type ControlButtonsProps = Pick<
  PostPageEntity,
  'hitLike' | 'likeCounter' | 'isAuthor' | 'title' | 'body'
> & {
  postId: number;
};

function ControlButtons({
  postId,
  hitLike,
  likeCounter,
  isAuthor,
  title,
  body,
}: ControlButtonsProps) {
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const navigate = useNavigate();

  const { mutate: onClickLike } = useLikePost();
  const { mutate: deletePost } = useDeletePost(postId);
  const { mutate: onPostEdit } = useUpdatePost(postId);

  const onClickDelete = () => {
    deletePost(postId);
    navigate('/');
  };

  return (
    <div className={styles.buttons}>
      <div className={styles.likes}>
        <span className={styles.like_counter}>{likeCounter}</span>
        <FavoriteIcon
          aria-label='like'
          onClick={() => onClickLike({ currentLikeState: hitLike, postId })}
          sx={{
            stroke: hitLike ? undefined : 'red',
            color: hitLike ? 'red' : 'white',
          }}
        />
      </div>
      {isAuthor && (
        <div className={styles.controls}>
          <StyledButton
            aria-label='Manage post'
            variant="secondary"
            onClick={e => setAnchorEl(anchorEl ? null : e.currentTarget)}
          >
            <SettingsIcon />
          </StyledButton>
          <Dropdown anchorEl={anchorEl} onClose={() => setAnchorEl(null)}>
            <StyledButton
              aria-label='Edit post'
              variant="secondary"
              onClick={() => {
                setAnchorEl(null);
                setIsEditModalOpen(true);
              }}
            >
              Редактировать пост
            </StyledButton>
            <StyledButton
              aria-label='Delete post'
              variant="secondary"
              onClick={() => {
                setAnchorEl(null);
                onClickDelete();
              }}
            >
              Удалить пост
            </StyledButton>
          </Dropdown>

          <Modal
            open={isEditModalOpen}
            onClose={() => setIsEditModalOpen(false)}
            aria-labelledby="edit-post"
            aria-describedby="Edits the post"
          >
            <DialogContent>
              <EditPostModalContent
                defaultValues={{ title, body }}
                onClose={() => setIsEditModalOpen(false)}
                save={onPostEdit}
              />
            </DialogContent>
          </Modal>
        </div>
      )}
    </div>
  );
}

export { ControlButtons };
