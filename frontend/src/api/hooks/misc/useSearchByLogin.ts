import axios from '@/api/axios';
import { ProfileEntity } from '@/types/profiles';
import { AxiosError } from 'axios';
import { useQuery } from 'react-query';

async function searchByLogin(login: string) {
  const { data } = await axios.get<ProfileEntity[]>(`user/login/${login}`);

  return data;
}

const QUERY_KEY = 'search';

function useSearchByLogin(login: string) {
  return useQuery<ProfileEntity[], AxiosError>({
    queryFn: () => searchByLogin(login),
    queryKey: [QUERY_KEY, login],
    enabled: Boolean(login),
    keepPreviousData: true,
  });
}

export { useSearchByLogin };
