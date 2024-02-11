import { describe, expect, it, vi } from 'vitest';
import { fireEvent } from '@testing-library/react';
import { renderWithRouter } from '@/test/renderWithRouter';
import {
  EditProfileModal,
  EditProfileModalProps,
} from '@/components/Profile/EditProfileModal';
import { editProfileEntity } from '@/test/mocks';

const setup = ({ save, onClose, defaultValues }: EditProfileModalProps) => {
  const rendered = renderWithRouter(
    <EditProfileModal
      onClose={onClose}
      save={save}
      defaultValues={defaultValues}
    />,
    [],
  );

  const shortInfoInput = rendered.getByLabelText('short-info');
  const passwordInput = rendered.getByLabelText('password');
  const repeatPasswordInput = rendered.getByLabelText('repeat-password');
  const saveButton = rendered.getByText('Сохранить');
  const closeButton = rendered.getByText('Закрыть');

  return {
    rendered,
    shortInfoInput,
    passwordInput,
    repeatPasswordInput,
    saveButton,
    closeButton,
  };
};

const VALID_PASSWORD = 'x'.repeat(10);
const VALID_SHORT_INFO = 'x'.repeat(10);

describe('EditProfileModal', () => {
  it('save button should be disabled when fields are empty', async () => {
    const { shortInfoInput, passwordInput, repeatPasswordInput, saveButton } =
      setup({
        save: () => {},
        onClose: () => {},
        defaultValues: editProfileEntity,
      });

    fireEvent.change(shortInfoInput, {
      target: {
        value: '',
      },
    });
    fireEvent.change(passwordInput, {
      target: {
        value: '',
      },
    });
    fireEvent.change(repeatPasswordInput, {
      target: {
        value: '',
      },
    });

    expect(saveButton).toBeDisabled();
  });

  it('save button should be enabled when fields are correct', async () => {
    const { shortInfoInput, passwordInput, repeatPasswordInput, saveButton } =
      setup({
        save: () => {},
        onClose: () => {},
        defaultValues: editProfileEntity,
      });

    fireEvent.change(shortInfoInput, {
      target: {
        value: VALID_SHORT_INFO,
      },
    });
    fireEvent.change(passwordInput, {
      target: {
        value: VALID_PASSWORD,
      },
    });
    fireEvent.change(repeatPasswordInput, {
      target: {
        value: VALID_PASSWORD,
      },
    });

    expect(saveButton).not.toBeDisabled();
  });

  it('save button should be disabled when short info is too large', async () => {
    const { shortInfoInput, passwordInput, repeatPasswordInput, saveButton } =
      setup({
        save: () => {},
        onClose: () => {},
        defaultValues: editProfileEntity,
      });

    fireEvent.change(shortInfoInput, {
      target: {
        value: 'x'.repeat(251),
      },
    });
    fireEvent.change(passwordInput, {
      target: {
        value: VALID_PASSWORD,
      },
    });
    fireEvent.change(repeatPasswordInput, {
      target: {
        value: VALID_PASSWORD,
      },
    });

    expect(saveButton).toBeDisabled();
  });

  it('save button should be disabled when passwords are too long', async () => {
    const { shortInfoInput, passwordInput, repeatPasswordInput, saveButton } =
      setup({
        save: () => {},
        onClose: () => {},
        defaultValues: editProfileEntity,
      });

    fireEvent.change(shortInfoInput, {
      target: {
        value: VALID_SHORT_INFO,
      },
    });
    fireEvent.change(passwordInput, {
      target: {
        value: 'x'.repeat(51),
      },
    });
    fireEvent.change(repeatPasswordInput, {
      target: {
        value: 'x'.repeat(51),
      },
    });

    expect(saveButton).toBeDisabled();
  });

  it('save button should be disabled when passwords differ', async () => {
    const { shortInfoInput, passwordInput, repeatPasswordInput, saveButton } =
      setup({
        save: () => {},
        onClose: () => {},
        defaultValues: editProfileEntity,
      });

    fireEvent.change(shortInfoInput, {
      target: {
        value: VALID_SHORT_INFO,
      },
    });
    fireEvent.change(passwordInput, {
      target: {
        value: 'x'.repeat(10),
      },
    });
    fireEvent.change(repeatPasswordInput, {
      target: {
        value: 'x'.repeat(11),
      },
    });

    expect(saveButton).toBeDisabled();
  });

  it('should call save() with correct data', async () => {
    const data = {
      shortInfo: 'x'.repeat(10),
      password: 'x'.repeat(10),
      repeatPassword: 'x'.repeat(10),
    };

    const mock = vi.fn();

    const { shortInfoInput, passwordInput, repeatPasswordInput, saveButton } =
      setup({
        save: mock,
        onClose: () => {},
        defaultValues: editProfileEntity,
      });

    fireEvent.change(shortInfoInput, {
      target: {
        value: data.shortInfo,
      },
    });
    fireEvent.change(passwordInput, {
      target: {
        value: data.password,
      },
    });
    fireEvent.change(repeatPasswordInput, {
      target: {
        value: data.repeatPassword,
      },
    });

    fireEvent.click(saveButton);

    expect(mock).toBeCalledWith(data);
  });

  it('should call onClose() when close button is pressed', async () => {
    const mock = vi.fn();

    const { closeButton } = setup({
      save: () => {},
      onClose: mock,
      defaultValues: editProfileEntity,
    });

    fireEvent.click(closeButton);

    expect(mock).toBeCalledTimes(1);
  });
});
