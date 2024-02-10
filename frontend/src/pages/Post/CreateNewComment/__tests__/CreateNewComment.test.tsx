import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render } from '@testing-library/react';
import { CreateNewComment } from '@/pages/Post/CreateNewComment';
import { pagination } from '@/test/mocks';
import userEvent from '@testing-library/user-event';
import { createWrapper } from '@/test/QueryProviderTestWrapper';

import * as module from '@/api/hooks/post/useCreateComment';

const useCreateCommentSpy = vi.spyOn(
  module,
  'useCreateComment'
);

describe('CreateNewComment', () => {
  it('the comment button should be disabled on empty field', async () => {
    const user = userEvent.setup();
    const wrapper = createWrapper();

    const rendered = render(<CreateNewComment postId={1} pagination={pagination} />, {
      wrapper
    });

    const button = rendered.container.querySelector('button')!;
    const input = rendered.container.querySelector('textarea')!;

    await user.clear(input);

    expect(button).toBeDisabled();
  });

  it('the comment button should be enabled on field with 1 symbol', async () => {
    const user = userEvent.setup();
    const wrapper = createWrapper();

    const rendered = render(<CreateNewComment postId={1} pagination={pagination} />, {
      wrapper
    });

    const button = rendered.container.querySelector('button')!;
    const input = rendered.container.querySelector('textarea')!;

    await user.type(input, 'x'.repeat(1));

    expect(button).not.toBeDisabled();
  });

  it('the comment button should be enabled on field with 600 symbols', async () => {
    const wrapper = createWrapper();

    const rendered = render(<CreateNewComment postId={1} pagination={pagination} />, {
      wrapper
    });

    const button = rendered.container.querySelector('button')!;
    const input = rendered.container.querySelector('textarea')!;

    const string = 'x'.repeat(600);

    fireEvent.change(input, {
      target: {
        value: string
      }
    });

    expect(button).not.toBeDisabled();
  });

  it('the comment button should be disabled on field with 601 symbol', async () => {
    const wrapper = createWrapper();

    const rendered = render(<CreateNewComment postId={1} pagination={pagination} />, {
      wrapper
    });

    const button = rendered.container.querySelector('button')!;
    const input = rendered.container.querySelector('textarea')!;

    const string = 'x'.repeat(601);

    fireEvent.change(input, {
      target: {
        value: string
      }
    });

    expect(button).toBeDisabled();
  });

  it('the comment button should send correct comment body and post id', async () => {
    const mock = vi.fn();

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    useCreateCommentSpy.mockImplementation(() => {
        return ({
          mutate: mock
        });
      }
    );
    const MESSAGE = 'test message';
    const POST_ID = 1;

    const user = userEvent.setup();
    const wrapper = createWrapper();

    const rendered = render(<CreateNewComment postId={POST_ID} pagination={pagination} />, {
      wrapper
    });

    const button = rendered.container.querySelector('button')!;
    const input = rendered.container.querySelector('textarea')!;

    await user.type(input, MESSAGE);
    await user.click(button);

    expect(mock).toBeCalledWith({
      body: MESSAGE,
      postId: POST_ID
    });
  });
});