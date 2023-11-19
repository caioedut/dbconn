import useSWR from 'swr';

import api from '@/services/api';

export default function useApi<DataType>(url: any | string, ...args: any[]) {
  const key = `${url}_${JSON.stringify(args)}`;

  return useSWR<DataType>(key, () => api.get(url, ...args).then((response: any) => response.data));
}
