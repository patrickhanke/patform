import { ApolloRefetch } from '@repo/types';
import { ColumnDef } from '@tanstack/react-table';
import { Service } from '@types';
import { Dispatch, SetStateAction } from 'react';

export type ServiceSettingsProps = {
    projectId: string;
    createService: boolean;
    setCreateService: Dispatch<SetStateAction<boolean>>;
};

export type UpdateHandler = (T: {
    serviceId: string;
    updateObject: { [key: string]: any };
}) => void;

export type UseServiceSettingsTableColumns = (T: {
    updateHandler: UpdateHandler;
}) => ColumnDef<Service>[];

export type CreateServiceProps = {
    createService: ServiceSettingsProps['createService'];
    setCreateService: ServiceSettingsProps['setCreateService'];
    refetch: ApolloRefetch;
};
