import { useState } from 'react';
import { useParams } from 'react-router-dom';
import styles from './PostPage.module.scss';
import dayjs from 'dayjs';
import { CircularProgress, TablePagination } from '@mui/material';
import { PaginationParams } from '@/types/pages';
import { StyledLink } from '@/components/Link';
import { dateFormat } from '@/const/dates';
import { useGetPost } from '@/api/hooks/post/useGetPost';
import { useGetPostComments } from '@/api/hooks/post/useGetPostComments';
import { CreateNewComment } from './CreateNewComment';
import { ControlButtons } from './ControlButtons';

function PostPage() {
  const { id } = useParams();
  const postId = parseInt(id || '0', 10);

  const [pagination, setPagination] = useState<PaginationParams>({
    page: 0,
    size: 10,
    order: 'desc',
    type: 'likeCounter', 
  });

  const { data: postData } = useGetPost(postId);
  const { data: postComments } = useGetPostComments({
    postId: postId,
    pagination,
  });

  if (!postData) {
    return <CircularProgress />;
  }

  const {
    title,
    body,
    createdAt,
    authorId,
    authorLogin,
    likeCounter,
    hitLike,
    isAuthor,
  } = postData;

  return (
    <>
      <article className={styles.post}>
        <header className={styles.block}>
          <h2 className={styles.title}>{title}</h2>
          <span className={styles.author}>
            {
              <StyledLink to={`/profiles/${authorId}`}>
                {authorLogin}
              </StyledLink>
            }{' '}
            &bull; {dayjs(createdAt).format(dateFormat)}
          </span>
        </header>
        <p className={styles.body}>{body}</p>
        <ControlButtons
          title={title}
          body={body}
          likeCounter={likeCounter}
          hitLike={hitLike}
          isAuthor={isAuthor}
          postId={postId}
        />
      </article>
      <CreateNewComment postId={postId} pagination={pagination} />
      <div className={styles.comments}>
        <h3>Комментарии</h3>
        <TablePagination
          labelDisplayedRows={({ from, to, count }) =>
            `${from}–${to} из ${count !== -1 ? count : `больше, чем ${to}`}`
          }
          labelRowsPerPage="Комментариев на странице:"
          count={postComments?.totalElements || 0}
          page={pagination.page}
          onPageChange={(_, page) => setPagination(prev => ({ ...prev, page }))}
          rowsPerPageOptions={[10, 20, 30]}
          rowsPerPage={pagination.size}
          onRowsPerPageChange={e =>
            setPagination(prev => ({
              ...prev,
              size: parseInt(e.target.value, 10),
            }))
          }
        />
        {postComments?.content?.map(comment => (
          <div className={styles.comment} key={comment.id}>
            <span className={styles.comment_author}>
              {comment.authorLogin} пишет:{' '}
            </span>
            <span>{comment.body}</span>
          </div>
        ))}
      </div>
    </>
  );
}

export { PostPage };
