import { describe, expect, it } from 'vitest';
import { act, renderHook, waitFor } from '@testing-library/react';
import { createWrapper } from '@/test/unit/QueryProviderTestWrapper';
import { useSearchByLogin } from '@/api/hooks/misc/useSearchByLogin';
import { profiles } from '@/test/unit/mocks';

describe('useSearchByLogin', () => {
  it('should fetch users by login', async () => {
    const { result } = renderHook(() => useSearchByLogin('login'), {
      wrapper: createWrapper(),
    });

    await act(() => result.current.refetch());

    await waitFor(() =>
      expect(result.current.isSuccess, 'fetching failed').toBe(true),
    );

    expect(result.current.data).toStrictEqual(profiles);
  });
});
