import { useState, forwardRef } from 'react';
import styles from './EditPostModalContent.module.scss';
import { StyledButton } from '@/components/Button';
import { EditableContent } from '@/types/posts';

interface EditPostModalContentProps {
  defaultValues: EditableContent;
  onClose: () => void;
  save: (content: EditableContent) => void;
}

const EditPostModalContent = forwardRef<
  HTMLDivElement,
  EditPostModalContentProps
>(function EditPostModalContent(
  { onClose, save, defaultValues }: EditPostModalContentProps,
  ref?,
) {
  const [content, setContent] = useState<EditableContent>(defaultValues);

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

  const isSaveButtonDisabled =
    content.title.length === 0 ||
    content.title.length > 120 ||
    content.body.length === 0 ||
    content.body.length > 600;

  return (
    <div className={styles.content} ref={ref}>
      <h2>Редактирование данных поста</h2>
      <label htmlFor="title">Заголовок</label>
      <textarea
        id="title"
        className={`${styles.input} ${styles.title_input}`}
        value={content.title}
        onChange={e => onChangeField('title', e.target.value)}
      />
      <label htmlFor="body">Тело</label>
      <textarea
        id="body"
        className={`${styles.input} ${styles.body_input}`}
        value={content.body}
        onChange={e => onChangeField('body', e.target.value)}
      />
      <div className={styles.buttons}>
        <StyledButton onClick={onClickSave} disabled={isSaveButtonDisabled}>
          Сохранить
        </StyledButton>
        <StyledButton onClick={onClose}>Закрыть</StyledButton>
      </div>
    </div>
  );
});

export { EditPostModalContent };
