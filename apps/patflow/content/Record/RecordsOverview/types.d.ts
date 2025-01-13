import { ApolloRefetch, Record } from '@types';

export type GetRecordObject = {
  loading: boolean;
  records: Record[];
  refetch: ApolloRefetch;
};



