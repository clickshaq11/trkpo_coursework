import { describe, expect, it } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { createWrapper } from '@/test/QueryProviderTestWrapper';
import { pagination, posts } from '@/test/mocks';
import { useGetOtherProfilePosts } from '@/api/hooks/other-profile/useGetOtherProfilePosts';

describe('useGetOtherProfilePosts', () => {
  it('should get other profile posts', async () => {
    const { result } = renderHook(() => useGetOtherProfilePosts({ pagination, userId: 1 }), {
      wrapper: createWrapper()
    })

    await waitFor(() => expect(result.current.isSuccess, "fetching failed").toBe(true))

    expect(result.current.data).toStrictEqual(posts)
  });
});
