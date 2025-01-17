import { ApolloRefetch, Record } from '@types';

export type EditRecordProps = {
    record: Record;
    refetch: ApolloRefetch;
    projectId: string;
}