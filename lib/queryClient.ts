import { QueryClient } from '@tanstack/react-query';
import { cache } from 'react';

const makeQueryClient = () => {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 1000 * 60 * 5,
        gcTime: 1000 * 60 * 10,
        retry: 1,
        refetchOnWindowFocus: process.env.NODE_ENV === 'development',
      },
    },
  });
};

const getQueryClient = cache(makeQueryClient);

export default getQueryClient;