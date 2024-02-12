import { describe, expect, it } from 'vitest';
import { act, renderHook, waitFor } from '@testing-library/react';
import { createWrapper } from '@/test/QueryProviderTestWrapper';
import { useCreateComment } from '@/api/hooks/post/useCreateComment';
import { pagination } from '@/test/mocks';

describe('useCreateComment', () => {
  it('should create new comment', async () => {
    const { result } = renderHook(
      () =>
        useCreateComment({
          pagination,
          postId: 1,
        }),
      {
        wrapper: createWrapper(),
      },
    );

    act(() =>
      result.current.mutate({
        postId: 1,
        body: '123',
      }),
    );

    await waitFor(() =>
      expect(result.current.isSuccess, 'fetching failed').toBe(true),
    );
  });
});
