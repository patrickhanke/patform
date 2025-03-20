import { ApolloRefetch, Record } from "@repo/types";

export type EditRecordProps = {
  record: Record;
  refetch: ApolloRefetch;
  projectId: string;
};
