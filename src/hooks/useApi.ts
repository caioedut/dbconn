import useSWR from 'swr';

import api from '@/services/api';

export default function useApi<DataType>(url: any | string, ...args: any[]) {
  const key = url ? `${url}_${JSON.stringify(args)}` : false;

  return useSWR<DataType>(key, () => api.get(url, ...args).then((response: any) => response.data), {
    focusThrottleInterval: 30000,
  });
}
