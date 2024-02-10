import { describe, expect, it } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { createWrapper } from '@/test/QueryProviderTestWrapper';
import { useGetMyProfile } from '@/api/hooks/my-profile/useGetMyProfile';
import { myProfile } from '@/test/mocks';

describe('useGetMyProfile', () => {
  it('should get own user profile', async () => {
    const { result } = renderHook(() => useGetMyProfile(), {
      wrapper: createWrapper()
    })

    await waitFor(() => expect(result.current.isSuccess, "fetching failed").toBe(true))

    expect(result.current.data).toStrictEqual(myProfile)
  });
});
