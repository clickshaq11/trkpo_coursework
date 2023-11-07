import axios from '@/api/axios';
import { fakeProfiles } from '@/api/fake-data';
import { ProfileEntity } from '@/types/profiles';
import { AxiosError } from 'axios';
import { useQuery } from 'react-query';

async function searchByLogin(login: string) {
  // TODO: remove
  return new Promise<ProfileEntity[]>(res =>
    setTimeout(
      () => res(fakeProfiles.filter(p => p.login.includes(login))),
      100,
    ),
  );

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
