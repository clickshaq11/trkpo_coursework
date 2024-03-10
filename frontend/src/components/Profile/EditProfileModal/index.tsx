import { forwardRef, useState } from 'react';
import { EditProfileEntity } from '@/types/profiles';
import styles from './EditProfileModal.module.scss';
import { StyledButton } from '@/components/Button';

export interface EditProfileModalProps {
  defaultValues: EditProfileEntity;
  onClose: () => void;
  save?: (content: EditProfileEntity) => void;
}

type FieldsType = EditProfileEntity & {
  repeatPassword: EditProfileEntity['password'];
};

const EditProfileModal = forwardRef<HTMLDivElement, EditProfileModalProps>(
  function EditProfileModal(
    { defaultValues, onClose, save }: EditProfileModalProps,
    ref,
  ) {
    const [content, setContent] = useState<FieldsType>({
      ...defaultValues,
      repeatPassword: defaultValues.password,
    });

    const onChangeField = (
      field: keyof FieldsType,
      value: FieldsType[typeof field],
    ) => {
      setContent(prev => ({
        ...prev,
        [field]: value,
      }));
    };

    const onClickSave = () => {
      onClose();
      save?.(content);
    };

    const isSaveButtonDisabled =
      content.shortInfo.length === 0 ||
      content.shortInfo.length > 250 ||
      content.password.length < 8 ||
      content.password.length > 50 ||
      content.password !== content.repeatPassword;

    return (
      <div className={styles.content} ref={ref}>
        <h2>Обновление информации профиля</h2>
        <label htmlFor="update_short-info">Краткая информация</label>
        <textarea
          aria-label="short-info"
          placeholder="Введите краткую информацию"
          id="update_short-info"
          className={`${styles.input} ${styles.short_info}`}
          value={content.shortInfo}
          onChange={e => onChangeField('shortInfo', e.target.value)}
        />
        <label htmlFor="update_password">Пароль</label>
        <input
          aria-label="password"
          type="password"
          placeholder="Введите пароль"
          id="update_password"
          className={`${styles.input} ${styles.password}`}
          value={content.password}
          onChange={e => onChangeField('password', e.target.value)}
        />
        <label htmlFor="update_repeat-password">Повторите пароль</label>
        <input
          aria-label="repeat-password"
          type="password"
          placeholder="Повторите пароль"
          id="update_repeat-password"
          className={`${styles.input} ${styles.password}`}
          value={content.repeatPassword}
          onChange={e => onChangeField('repeatPassword', e.target.value)}
        />
        <div className={styles.buttons}>
          <StyledButton onClick={onClickSave} disabled={isSaveButtonDisabled}>
            Сохранить
          </StyledButton>
          <StyledButton onClick={onClose}>Закрыть</StyledButton>
        </div>
      </div>
    );
  },
);

export { EditProfileModal };
