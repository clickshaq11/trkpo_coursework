import { useState } from 'react';
import { useParams } from 'react-router-dom';
import styles from './PostPage.module.scss';
import dayjs from 'dayjs';
import { CircularProgress } from '@mui/material';
import { PaginationParams } from '@/types/pages';
import { StyledLink } from '@/components/Link';
import { dateFormat } from '@/const/dates';
import { useGetPost } from '@/api/hooks/post/useGetPost';
import { useGetPostComments } from '@/api/hooks/post/useGetPostComments';
import { CreateNewComment } from './CreateNewComment';
import { ControlButtons } from './ControlButtons';
import { Pagination } from '@/components/Pagination';

function PostPage() {
  const { id } = useParams();
  const postId = parseInt(id || '0', 10);

  const [pagination, setPagination] = useState<PaginationParams>({
    page: 0,
    size: 10,
    order: 'desc',
    type: 'likeCounter',
  });

  const {
    data: postData,
    isSuccess: isGetPostSucceed,
    isError,
    error,
  } = useGetPost(postId);
  const { data: postComments, isSuccess: isGetPostCommentsSucceed } =
    useGetPostComments({
      postId: postId,
      pagination,
    });

  if (isError && error.response?.status === 404) {
    return <div>Такого поста не существует</div>;
  }

  if (!isGetPostSucceed || !isGetPostCommentsSucceed) {
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
    <div className={styles.content}>
      <article className={styles.post}>
        <header className={styles.block}>
          <h2 className={styles.title} data-testid='title'>{title}</h2>
          <span className={styles.author}>
            {
              <StyledLink to={`/profiles/${authorId}`}>
                {authorLogin}
              </StyledLink>
            }{' '}
            &bull; {dayjs(createdAt).format(dateFormat)}
          </span>
        </header>
        <p className={styles.body} data-testid='body'>{body}</p>
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
      <div className={styles.comments} id='comments'>
        <h3>Комментарии</h3>
        <Pagination
          pagination={{
            paginationParams: pagination,
            setPaginationParams: setPagination,
          }}
          totalPages={postComments.totalPages}
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
    </div>
  );
}

export { PostPage };
