import { useState } from 'react';
import { StyledButton } from '@/components/Button';
import styles from './CreateNewComment.module.scss';
import { useCreateComment } from '@/api/hooks/post/useCreateComment';
import { PaginationParams } from '@/types/pages';

interface CreateNewCommentProps {
  postId: number;
  pagination: PaginationParams;
}

function CreateNewComment(props: CreateNewCommentProps) {
  const [currentCommentText, setCurrentCommentText] = useState<string>('');
  const { mutate: comment } = useCreateComment(props);

  const onComment = () => {
    setCurrentCommentText('');
    comment({
      body: currentCommentText,
      postId: props.postId,
    });
  };

  const isCommentButtonDisabled =
    currentCommentText.length === 0 || currentCommentText.length > 600;
  return (
    <div className={styles.create}>
      <h3>Добавить комментарий</h3>
      <textarea
        id='comment-text'
        placeholder="Введите текст комментария"
        value={currentCommentText}
        onChange={e => setCurrentCommentText(e.target.value)}
        className={styles.input}
      />
      <StyledButton
        id='create-comment'
        onClick={onComment} disabled={isCommentButtonDisabled}>
        Прокомментировать ({currentCommentText.length} из 600)
      </StyledButton>
    </div>
  );
}

export { CreateNewComment };
