import { DocumentNode } from '@apollo/client';
import { Day, DefaultDay } from '@types';

interface GetProjectsResponse {
    objects: any;
}

export type GenerateGraphQLQuery = ({
    type,
    objectName,
    fields,
}: {
    type: 'find' | 'get';
    objectName: string;
    fields: string[];
}) => DocumentNode;

type CreateTimeProps = (DefaultDay | Day) & {
    record_id: string;
    user_id: string;
};

export type CreateTime = (data: CreateTimeProps) => Promise<void>;
