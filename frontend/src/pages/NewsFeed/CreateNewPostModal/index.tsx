import { forwardRef, useState } from 'react';
import styles from './CreateNewPostModal.module.scss';
import { EditableContent } from '@/types/posts';
import { StyledButton } from '@/components/Button';

export interface CreateNewPostModalProps {
  onClose: () => void;
  save: (content: EditableContent) => void;
}

const CreateNewPostModal = forwardRef<HTMLDivElement, CreateNewPostModalProps>(
  function CreateNewPostModal(
    { onClose, save }: CreateNewPostModalProps,
    ref?,
  ) {
    const [content, setContent] = useState<EditableContent>({
      title: '',
      body: '',
    });

    const onChangeField = (
      field: keyof EditableContent,
      value: EditableContent[typeof field],
    ) => {
      setContent(prev => ({
        ...prev,
        [field]: value,
      }));
    };

    const onClickSave = () => {
      onClose();
      save(content);
    };

    const isPublishButtonDisabled =
      content.title.length === 0 ||
      content.title.length > 120 ||
      content.body.length === 0 ||
      content.body.length > 600;

    return (
      <div className={styles.content} ref={ref}>
        <h2>Создание нового поста</h2>
        <label htmlFor="title">Заголовок</label>
        <textarea
          aria-label="title"
          placeholder="Введите заголовок..."
          id="title"
          className={`${styles.input} ${styles.title_input}`}
          value={content.title}
          onChange={e => onChangeField('title', e.target.value)}
        />
        <label htmlFor="body">Тело</label>
        <textarea
          aria-label="body"
          placeholder="Введите тело поста..."
          id="body"
          className={`${styles.input} ${styles.body_input}`}
          value={content.body}
          onChange={e => onChangeField('body', e.target.value)}
        />
        <div className={styles.buttons}>
          <StyledButton
            aria-label="publish"
            onClick={onClickSave}
            disabled={isPublishButtonDisabled}
            role="button"
          >
            Опубликовать
          </StyledButton>
          <StyledButton onClick={onClose} aria-label="close">
            Закрыть
          </StyledButton>
        </div>
      </div>
    );
  },
);

export { CreateNewPostModal };
