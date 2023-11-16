import axios from '@/api/axios';
import { MyProfileEntity } from '@/types/profiles';
import { AxiosError } from 'axios';
import { useQuery } from 'react-query';

async function getMyProfile() {
  const { data } = await axios.get<MyProfileEntity>('user/me');

  return data;
}

const QUERY_KEY = 'my-profile';

function useGetMyProfile() {
  return useQuery<MyProfileEntity, AxiosError>({
    queryFn: getMyProfile,
    queryKey: QUERY_KEY,
  });
}

export { useGetMyProfile, QUERY_KEY as MY_PROFILE_QUERY_KEY };
