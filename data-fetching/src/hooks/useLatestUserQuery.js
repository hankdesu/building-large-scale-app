import { useQuery } from '@tanstack/react-query';

import { fetchLatestUser, graphqlLatestUser } from '../apis/users';

export default function useLatestUserQuery(graphql = false) {
  return useQuery({
    queryKey: ['user'],
    queryFn: graphql ? graphqlLatestUser : fetchLatestUser,
    retry: 1,
  });
}
