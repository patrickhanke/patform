import { ApolloRefetch } from '@repo/types';

export type PropertySettingsProps = {
    propertyId: string;
    refetch: ApolloRefetch;
};

export type ArchivePropertyProps = {
    propertyId: string;
    refetch: ApolloRefetch;
    isArchived: boolean | undefined;
};
