import { describe, expect, it } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { createWrapper } from '@/test/QueryProviderTestWrapper';
import { post } from '@/test/mocks';
import { useGetPost } from '@/api/hooks/post/useGetPost';

describe('useGetPost', () => {
  it('should get post', async () => {
    const { result } = renderHook(() => useGetPost(1), {
      wrapper: createWrapper()
    })

    await waitFor(() => expect(result.current.isSuccess, "fetching failed").toBe(true))

    expect(result.current.data).toStrictEqual(post)
  });
});
