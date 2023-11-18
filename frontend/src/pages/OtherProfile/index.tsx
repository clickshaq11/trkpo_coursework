import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Profile } from '@/components/Profile';
import { PaginationParams } from '@/types/pages';
import { useGetOtherProfilePosts } from '@/api/hooks/other-profile/useGetOtherProfilePosts';
import { useGetOtherProfile } from '@/api/hooks/other-profile/useGetOtherProfile';
import { CircularProgress } from '@mui/material';
import { useSubscribe } from '@/api/hooks/other-profile/useSubcribe';

function ProfilePage() {
  const { id } = useParams();
  const userId = parseInt(id || '0', 10);

  const [paginationParams, setPaginationParams] = useState<PaginationParams>({
    size: 10,
    page: 0,
    order: 'asc',
    type: 'likeCounter',
  });

  const { data: profile, isLoading } = useGetOtherProfile(userId);

  const { data: posts } = useGetOtherProfilePosts({
    pagination: paginationParams,
    userId,
  });

  const { mutate: subscribe } = useSubscribe(userId);

  if (isLoading) {
    return <CircularProgress />;
  }

  return (
    <Profile
      subscribe={subscribe}
      profileData={profile}
      isOwnProfile={false}
      posts={posts}
      pagination={{ paginationParams, setPaginationParams }}
    />
  );
}

export { ProfilePage };
