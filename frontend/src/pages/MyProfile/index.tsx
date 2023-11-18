import { useState } from 'react';
import { useGetMyProfile } from '@/api/hooks/my-profile/useGetMyProfile';
import { useGetMyProfilePosts } from '@/api/hooks/my-profile/useGetMyProfilePosts';
import { useUpdateMyProfile } from '@/api/hooks/my-profile/useUpdateMyProfile';
import { Profile } from '@/components/Profile';
import { PaginationParams } from '@/types/pages';
import CircularProgress from '@mui/material/CircularProgress';

function MyProfile() {
  const [paginationParams, setPaginationParams] = useState<PaginationParams>({
    size: 10,
    page: 0,
    order: 'asc',
    type: 'likeCounter',
  });

  const { data: myProfile, isSuccess: isGetMyProfileSucceed } = useGetMyProfile();
  const { data: myPosts,  isSuccess: isGetMyPostsSucceed  } = useGetMyProfilePosts({
    pagination: paginationParams,
  });

  const { mutate: onProfileEdit } = useUpdateMyProfile();

  if (!isGetMyPostsSucceed || !isGetMyProfileSucceed) {
    return <CircularProgress />;
  }

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
