import { describe, expect, it } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { createWrapper } from '@/test/QueryProviderTestWrapper';
import { comments, pagination } from '@/test/mocks';
import { useGetPostComments } from '@/api/hooks/post/useGetPostComments';

describe('useGetPostComments', () => {
  it('should get post comments', async () => {
    const { result } = renderHook(
      () => useGetPostComments({ pagination, postId: 1 }),
      {
        wrapper: createWrapper(),
      },
    );

    await waitFor(() =>
      expect(result.current.isSuccess, 'fetching failed').toBe(true),
    );

    expect(result.current.data).toStrictEqual(comments);
  });
});
