import { describe, expect, it } from 'vitest';
import { act, renderHook, waitFor } from '@testing-library/react';
import { createWrapper } from '@/test/QueryProviderTestWrapper';
import { useSubscribe } from '@/api/hooks/other-profile/useSubcribe';

describe('useSubscribe', () => {
  it('should send subscribe request', async () => {
    const { result } = renderHook(() => useSubscribe(1), {
      wrapper: createWrapper(),
    });

    act(() => result.current.mutate(true));

    await waitFor(() =>
      expect(result.current.isSuccess, 'fetching failed').toBe(true),
    );
  });
});
