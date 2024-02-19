import { describe, expect, it } from 'vitest';
import { act, renderHook, waitFor } from '@testing-library/react';
import { createWrapper } from '@/test/unit/QueryProviderTestWrapper';
import { useLikePost } from '@/api/hooks/shared/useLikePost';

describe('useSubscribe', () => {
  it('should send subscribe request', async () => {
    const { result } = renderHook(() => useLikePost(), {
      wrapper: createWrapper(),
    });

    act(() =>
      result.current.mutate({
        currentLikeState: false,
        postId: 1,
      }),
    );

    await waitFor(() =>
      expect(result.current.isSuccess, 'fetching failed').toBe(true),
    );
  });
});
