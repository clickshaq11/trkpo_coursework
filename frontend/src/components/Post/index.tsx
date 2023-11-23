import FavoriteIcon from '@mui/icons-material/Favorite';
import dayjs from 'dayjs';
import styles from './Post.module.scss';
import { PostEntity } from '@/types/posts';
import { dateFormat } from '@/const/dates';
import { useLikePost } from '@/api/hooks/shared/useLikePost';

interface PostProps extends PostEntity {
  userId?: number;
}

function Post({
  id,
  title,
  body,
  authorLogin,
  createdAt,
  likeCounter,
  hitLike,
  firstComments,
  userId,
}: PostProps) {
  const { mutate: likePost } = useLikePost();

  return (
    <article className={styles.post}>
      <header className={styles.block}>
        <h2 className={styles.title}>{title}</h2>
        <span className={styles.author}>
          {authorLogin} &bull; {dayjs(createdAt).format(dateFormat)}
        </span>
      </header>
      <p className={styles.body}>{body}</p>
      <div
        className={styles.likes}
        onClick={() =>
          likePost({ currentLikeState: hitLike, postId: id, userId })
        }
      >
        <span className={styles.like_counter}>{likeCounter}</span>
        <FavoriteIcon
          sx={{
            stroke: hitLike ? undefined : 'red',
            color: hitLike ? 'red' : 'white',
          }}
        />
      </div>
      <br />
      <hr />
      <div className={styles.comments}>
        {firstComments.map(comment => (
          <div className={styles.comment} key={comment.id}>
            <span className={styles.comment_author}>
              {comment.authorLogin} пишет:{' '}
            </span>
            <span>{comment.body}</span>
          </div>
        ))}
      </div>
    </article>
  );
}

export { Post };
