import { useState } from 'react';
import { useGetMyProfile } from '@/api/hooks/my-profile/useGetMyProfile';
import { useGetMyProfilePosts } from '@/api/hooks/my-profile/useGetMyProfilePosts';
import { useUpdateMyProfile } from '@/api/hooks/my-profile/useUpdateMyProfile';
import { Profile } from '@/components/Profile';
import { PaginationParams } from '@/types/pages';

function MyProfile() {
  const [paginationParams, setPaginationParams] = useState<PaginationParams>({
    size: 10,
    page: 0,
    order: 'asc',
    type: 'popularity',
  });

  const { data: myProfile } = useGetMyProfile();
  const { data: myPosts } = useGetMyProfilePosts({
    pagination: paginationParams,
  });

  const { mutate: onProfileEdit } = useUpdateMyProfile();

  return (
    <Profile
      profileData={myProfile}
      isOwnProfile
      posts={myPosts}
      pagination={{ paginationParams, setPaginationParams }}
      editProfileInfo={onProfileEdit}
    />
  );
}

export { MyProfile };
