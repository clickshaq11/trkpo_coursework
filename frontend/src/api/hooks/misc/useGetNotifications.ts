import axios from "@/api/axios";
import { fakeNotifications } from "@/api/fake-data";
import { Notification } from "@/types/notifications";
import { AxiosError } from "axios";
import { useQuery } from "react-query";

const QUERY_KEY = 'notifications';

async function getNotifications(signal: AbortSignal | undefined) {
  // TODO: delete
  return new Promise<Notification[]>(res => setTimeout(() => res(fakeNotifications), 500));

  const { data } = await axios.get<Notification[]>('notification', {
    signal
  })

  return data
}

function useGetNotifications() {
  return useQuery<Notification[], AxiosError>({
    queryFn: ({signal}) => getNotifications(signal),
    queryKey: QUERY_KEY,
  })
}

export { useGetNotifications };