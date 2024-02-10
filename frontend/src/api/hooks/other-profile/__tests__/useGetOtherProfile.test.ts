import { describe, expect, it } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { createWrapper } from '@/test/QueryProviderTestWrapper';
import { otherProfile } from '@/test/mocks';
import { useGetOtherProfile } from '@/api/hooks/other-profile/useGetOtherProfile';

describe('useGetOtherProfile', () => {
  it('should get other user profile', async () => {
    const { result } = renderHook(() => useGetOtherProfile(1), {
      wrapper: createWrapper()
    })

    await waitFor(() => expect(result.current.isSuccess, "fetching failed").toBe(true))

    expect(result.current.data).toStrictEqual(otherProfile)
  });
});
