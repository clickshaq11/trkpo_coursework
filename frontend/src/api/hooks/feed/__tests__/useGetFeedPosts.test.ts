import { describe, expect, it } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { createWrapper } from '@/test/QueryProviderTestWrapper';
import { useGetFeedPosts } from '@/api/hooks/feed/useGetFeedPosts';

describe('useGetFeedPosts', () => {
  it('should get user feed posts', async () => {
    const { result } = renderHook(() => useGetFeedPosts(), {
      wrapper: createWrapper(),
    });

    await waitFor(() =>
      expect(result.current.isSuccess, 'fetching failed').toBe(true),
    );
  });
});
