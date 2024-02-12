import { describe, expect, it, vi } from 'vitest';
import { ControlButtons } from '@/pages/Post/ControlButtons';
import { renderWithRouter } from '@/test/renderWithRouter';
import userEvent from '@testing-library/user-event';

import * as useDeletePostModule from '@/api/hooks/post/useDeletePost';

const POST_ID = 1;

const useDeletePostSpy = vi.spyOn(useDeletePostModule, 'useDeletePost');

const setup = ({ isAuthor = true }: { isAuthor: boolean }) => {
  const rendered = renderWithRouter(
    <ControlButtons
      title=""
      body=""
      likeCounter={0}
      hitLike={true}
      isAuthor={isAuthor}
      postId={POST_ID}
    />,
    [],
  );

  return {
    rendered,
  };
};

describe('ControlButtons', () => {
  it('should render like button', () => {
    const { rendered } = setup({ isAuthor: true });

    expect(rendered.getByLabelText(/like/i)).toBeInTheDocument();
  });

  it('should render post controls when isAuthor is true', () => {
    const { rendered } = setup({ isAuthor: true });

    expect(rendered.getByLabelText(/Manage post/i)).toBeInTheDocument();
  });

  it('should render edit and delete buttons when manage button is pressed', async () => {
    const user = userEvent.setup();

    const { rendered } = setup({ isAuthor: true });

    const manageButton = rendered.getByLabelText(/Manage post/i);

    await user.click(manageButton);

    expect(rendered.getByLabelText(/Edit post/i)).toBeInTheDocument();
    expect(rendered.getByLabelText(/Delete post/i)).toBeInTheDocument();
  });

  it('should call post delete when delete button is pressed', async () => {
    const mock = vi.fn();

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    useDeletePostSpy.mockImplementation(() => {
      return {
        mutate: mock,
      };
    });

    const user = userEvent.setup();

    const { rendered } = setup({ isAuthor: true });

    const manageButton = rendered.getByLabelText(/Manage post/i);

    await user.click(manageButton);

    const deleteButton = rendered.getByLabelText(/Delete post/i);

    await user.click(deleteButton);

    expect(mock).toBeCalledWith(POST_ID);
  });

  it('should open the edit post modal when edit button is pressed', async () => {
    const user = userEvent.setup();

    const { rendered } = setup({ isAuthor: true });

    const manageButton = rendered.getByLabelText(/Manage post/i);

    await user.click(manageButton);

    const updateButton = rendered.getByLabelText(/Edit post/i);

    await user.click(updateButton);

    expect(rendered.getByRole('presentation')).toBeInTheDocument();
  });
});
