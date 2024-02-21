import { describe, expect, it } from 'vitest';
import { act, renderHook, waitFor } from '@testing-library/react';
import { createWrapper } from '@/test/unit/QueryProviderTestWrapper';
import { editPost, post } from '@/test/unit/mocks';
import { useQueryClient } from 'react-query';
import { useUpdatePost } from '@/api/hooks/post/useUpdatePost';
import { getPostQueryKey, useGetPost } from '@/api/hooks/post/useGetPost';

const POST_ID = 1;

describe('useUpdatePost', () => {
  it('should send update post request', async () => {
    const { result } = renderHook(() => useUpdatePost(POST_ID), {
      wrapper: createWrapper(),
    });

    act(() => result.current.mutate(editPost));

    await waitFor(() =>
      expect(result.current.isSuccess, 'fetching failed').toBe(true),
    );
  });

  it('should optimistically update post profile', async () => {
    const wrapper = createWrapper();
    const { result: queryClient } = renderHook(() => useQueryClient(), {
      wrapper,
    });

    const { result: getPostQuery } = renderHook(() => useGetPost(POST_ID), {
      wrapper,
    });

    await waitFor(() => expect(getPostQuery.current.isSuccess).toBe(true));

    expect(queryClient.current.getQueryData(getPostQueryKey(POST_ID))).toEqual(
      expect.objectContaining(post),
    );

    const { result } = renderHook(() => useUpdatePost(POST_ID), {
      wrapper,
    });

    const prevQueryData = queryClient.current.getQueryData(
      getPostQueryKey(POST_ID),
    );

    await waitFor(() => result.current.mutate(editPost));

    expect(prevQueryData).not.toEqual(
      queryClient.current.getQueryData(getPostQueryKey(POST_ID)),
    );
  });
});
