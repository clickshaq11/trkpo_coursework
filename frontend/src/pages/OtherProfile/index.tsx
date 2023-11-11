import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Profile } from '@/components/Profile';
import { PaginationParams } from '@/types/pages';
import { useGetOtherProfilePosts } from '@/api/hooks/other-profile/useGetOtherProfilePosts';
import { useGetOtherProfile } from '@/api/hooks/other-profile/useGetOtherProfile';
import { CircularProgress } from '@mui/material';

function ProfilePage() {
  const { id } = useParams();
  const userId = parseInt(id || '0', 10);

  const [paginationParams, setPaginationParams] = useState<PaginationParams>({
    size: 10,
    page: 0,
    order: 'asc',
    type: 'date',
  });

  const { data: profile, isLoading } = useGetOtherProfile(userId);

  const { data: posts } = useGetOtherProfilePosts({
    userId,
    pagination: paginationParams,
  });

  if (isLoading) {
    return <CircularProgress />;
  }

  return (
    <Profile
      profileData={profile}
      isOwnProfile={false}
      posts={posts}
      pagination={{ paginationParams, setPaginationParams }}
    />
  );
}

export { ProfilePage };
