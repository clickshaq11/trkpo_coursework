import axios from '@/api/axios';
import { fakeProfile } from '@/api/fake-data';
import { ProfileEntity } from '@/types/profiles';
import { AxiosError } from 'axios';
import { useQuery } from 'react-query';

async function getOtherProfile(userId: number) {
  const { data } = await axios.get<ProfileEntity>(`user/id/${userId}`);

  return data;
}

const QUERY_KEY = 'other-profile';

function getOtherProfileQueryKey(userId: number) {
  return [QUERY_KEY, userId];
}

function useGetOtherProfile(userId: number) {
  return useQuery<ProfileEntity, AxiosError>({
    queryFn: () => getOtherProfile(userId),
    queryKey: getOtherProfileQueryKey(userId),
  });
}

export { useGetOtherProfile, getOtherProfileQueryKey };
