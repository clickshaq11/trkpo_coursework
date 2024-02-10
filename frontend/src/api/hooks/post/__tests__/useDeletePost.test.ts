import { describe, expect, it } from 'vitest';
import { act, renderHook, waitFor } from '@testing-library/react';
import { createWrapper } from '@/test/QueryProviderTestWrapper';
import { useDeletePost } from '@/api/hooks/post/useDeletePost';

describe('useDeletePost', () => {
  it('should delete new post', async () => {
    const { result } = renderHook(() => useDeletePost(1), {
      wrapper: createWrapper()
    })

    act(() => result.current.mutate(1))

    await waitFor(() => expect(result.current.isSuccess, "fetching failed").toBe(true))
  });
});