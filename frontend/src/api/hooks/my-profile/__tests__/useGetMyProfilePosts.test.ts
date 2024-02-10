import { describe, expect, it } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { createWrapper } from '@/test/QueryProviderTestWrapper';
import { posts, pagination } from '@/test/mocks';
import { useGetMyProfilePosts } from '@/api/hooks/my-profile/useGetMyProfilePosts';

describe('useGetMyProfilePosts', () => {
  it('should get own profile posts', async () => {
    const { result } = renderHook(() => useGetMyProfilePosts({ pagination }), {
      wrapper: createWrapper()
    })

    await waitFor(() => expect(result.current.isSuccess, "fetching failed").toBe(true))

    expect(result.current.data).toStrictEqual(posts)
  });
});
