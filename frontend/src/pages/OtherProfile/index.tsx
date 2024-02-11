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

  const { data: profile, isSuccess: isProfileSucceed } =
    useGetOtherProfile(userId);

  const { data: posts, isSuccess: arePostsSucceed } = useGetOtherProfilePosts({
    pagination: paginationParams,
    userId,
  });

  const { mutate: subscribe } = useSubscribe(userId);

  if (!isProfileSucceed || !arePostsSucceed) {
    return <CircularProgress />;
  }

  return (
    <Profile
      totalPages={posts.totalPages}
      totalRows={posts.totalElements}
      subscribe={subscribe}
      profileData={profile}
      isOwnProfile={false}
      posts={posts.content}
      pagination={{ paginationParams, setPaginationParams }}
    />
  );
}

export { ProfilePage };
