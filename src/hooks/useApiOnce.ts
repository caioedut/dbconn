import useSWR from 'swr';

import api from '@/services/api';

export default function useApiOnce<DataType>(url: any | string, ...args: any[]) {
  const key = url ? `${url}_${JSON.stringify(args)}` : false;

  return useSWR<DataType>(key, () => api.get(url, ...args).then((response: any) => response.data), {
    revalidateIfStale: true,
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  });
}
