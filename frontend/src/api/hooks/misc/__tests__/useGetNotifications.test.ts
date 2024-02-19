import { describe, expect, it } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { createWrapper } from '@/test/unit/QueryProviderTestWrapper';
import { useGetNotifications } from '@/api/hooks/misc/useGetNotifications';
import { notifications } from '@/test/unit/mocks';

describe('useGetNotifications', () => {
  it('should get notifications', async () => {
    const { result } = renderHook(() => useGetNotifications(), {
      wrapper: createWrapper(),
    });

    await waitFor(() =>
      expect(result.current.isSuccess, 'fetching failed').toBe(true),
    );

    expect(result.current.data).toStrictEqual(notifications);
  });
});
