import axios from '@/api/axios';
import { Notification } from '@/types/notifications';
import { AxiosError } from 'axios';
import { useQuery } from 'react-query';

const QUERY_KEY = 'notifications';

async function getNotifications(signal: AbortSignal | undefined) {
  const { data } = await axios.get<Notification[]>('notification', {
    signal,
  });

  return data;
}

function useGetNotifications() {
  return useQuery<Notification[], AxiosError>({
    queryFn: ({ signal }) => getNotifications(signal),
    queryKey: QUERY_KEY,
  });
}

export { useGetNotifications };
