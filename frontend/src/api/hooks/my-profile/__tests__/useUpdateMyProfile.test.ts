import { describe, expect, it } from 'vitest';
import { act, renderHook, waitFor } from '@testing-library/react';
import { createWrapper } from '@/test/unit/QueryProviderTestWrapper';
import { useUpdateMyProfile } from '@/api/hooks/my-profile/useUpdateMyProfile';
import { editProfileEntity, myProfile } from '@/test/unit/mocks';
import { useQueryClient } from 'react-query';
import {
  MY_PROFILE_QUERY_KEY,
  useGetMyProfile,
} from '@/api/hooks/my-profile/useGetMyProfile';

describe('useUpdateMyProfile', () => {
  it('should send update profile request', async () => {
    const { result } = renderHook(() => useUpdateMyProfile(), {
      wrapper: createWrapper(),
    });

    act(() => result.current.mutate(editProfileEntity));

    await waitFor(() =>
      expect(result.current.isSuccess, 'fetching failed').toBe(true),
    );
  });

  it('should optimistically update my profile', async () => {
    const wrapper = createWrapper();
    const { result: queryClient } = renderHook(() => useQueryClient(), {
      wrapper,
    });

    const { result: getMyProfileQuery } = renderHook(() => useGetMyProfile(), {
      wrapper,
    });

    await waitFor(() => expect(getMyProfileQuery.current.isSuccess).toBe(true));

    expect(queryClient.current.getQueryData(MY_PROFILE_QUERY_KEY)).toEqual(
      expect.objectContaining({ shortInfo: myProfile.shortInfo }),
    );

    const { result } = renderHook(() => useUpdateMyProfile(), {
      wrapper,
    });

    await waitFor(() => result.current.mutate(editProfileEntity));

    expect(queryClient.current.getQueryData(MY_PROFILE_QUERY_KEY)).toEqual(
      expect.objectContaining({ shortInfo: editProfileEntity.shortInfo }),
    );
  });
});
