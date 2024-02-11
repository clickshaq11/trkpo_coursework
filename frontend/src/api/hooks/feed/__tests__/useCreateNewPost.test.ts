import { describe, expect, it } from 'vitest';
import { act, renderHook, waitFor } from '@testing-library/react';
import { createWrapper } from '@/test/QueryProviderTestWrapper';
import { useCreateNewPost } from '@/api/hooks/feed/useCreateNewPost';

describe('useCreateNewPost', () => {
  it('should create new post', async () => {
    const { result } = renderHook(() => useCreateNewPost(), {
      wrapper: createWrapper(),
    });

    act(() =>
      result.current.mutate({
        title: '123',
        body: '123',
      }),
    );

    await waitFor(() =>
      expect(result.current.isSuccess, 'fetching failed').toBe(true),
    );
  });
});
