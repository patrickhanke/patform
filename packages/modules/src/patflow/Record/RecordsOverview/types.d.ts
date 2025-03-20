import { ApolloRefetch, Record } from "@repo/types";

export type GetRecordObject = {
  loading: boolean;
  records: Record[];
  refetch: ApolloRefetch;
};
