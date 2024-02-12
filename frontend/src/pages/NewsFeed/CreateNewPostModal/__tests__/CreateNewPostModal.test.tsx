import { describe, expect, it, vi } from 'vitest';
import { fireEvent } from '@testing-library/react';
import { renderWithRouter } from '@/test/renderWithRouter';
import {
  CreateNewPostModal,
  CreateNewPostModalProps,
} from '@/pages/NewsFeed/CreateNewPostModal';

const setup = ({ save, onClose }: CreateNewPostModalProps) => {
  const rendered = renderWithRouter(
    <CreateNewPostModal onClose={onClose} save={save} />,
    [],
  );

  const titleInput = rendered.getByLabelText('title');
  const bodyInput = rendered.getByLabelText('body');
  const publishButton = rendered.getByLabelText('publish');
  const closeButton = rendered.getByLabelText('close');

  return {
    rendered,
    titleInput,
    bodyInput,
    publishButton,
    closeButton,
  };
};

describe('CreateNewPostModal', () => {
  it('submit button should be disabled when fields are empty', async () => {
    const { titleInput, bodyInput, publishButton } = setup({
      save: () => {},
      onClose: () => {},
    });

    fireEvent.change(titleInput, {
      target: {
        value: '',
      },
    });
    fireEvent.change(bodyInput, {
      target: {
        value: '',
      },
    });

    expect(publishButton).toBeDisabled();
  });

  it('submit button should be enabled when fields are correct', async () => {
    const { titleInput, bodyInput, publishButton } = setup({
      save: () => {},
      onClose: () => {},
    });

    fireEvent.change(titleInput, {
      target: {
        value: 'x'.repeat(10),
      },
    });
    fireEvent.change(bodyInput, {
      target: {
        value: 'x'.repeat(10),
      },
    });

    expect(publishButton).not.toBeDisabled();
  });

  it('submit button should be disabled when title is correct size and body has 601 char', async () => {
    const { titleInput, bodyInput, publishButton } = setup({
      save: () => {},
      onClose: () => {},
    });

    fireEvent.change(titleInput, {
      target: {
        value: 'x'.repeat(10),
      },
    });
    fireEvent.change(bodyInput, {
      target: {
        value: 'x'.repeat(601),
      },
    });

    expect(publishButton).toBeDisabled();
  });

  it('submit button should be disabled when body is correct size and title has 121 char', async () => {
    const { titleInput, bodyInput, publishButton } = setup({
      save: () => {},
      onClose: () => {},
    });

    fireEvent.change(titleInput, {
      target: {
        value: 'x'.repeat(121),
      },
    });
    fireEvent.change(bodyInput, {
      target: {
        value: 'x'.repeat(10),
      },
    });

    expect(publishButton).toBeDisabled();
  });

  it('should call save() with correct post data', async () => {
    const data = {
      title: 'x'.repeat(10),
      body: 'x'.repeat(10),
    };

    const mock = vi.fn();

    const { titleInput, bodyInput, publishButton } = setup({
      save: mock,
      onClose: () => {},
    });

    fireEvent.change(titleInput, {
      target: {
        value: data.title,
      },
    });
    fireEvent.change(bodyInput, {
      target: {
        value: data.body,
      },
    });

    fireEvent.click(publishButton);

    expect(mock).toBeCalledWith(data);
  });

  it('should call onClose() when close button is pressed', async () => {
    const mock = vi.fn();

    const { closeButton } = setup({
      save: () => {},
      onClose: mock,
    });

    fireEvent.click(closeButton);

    expect(mock).toBeCalledTimes(1);
  });
});
