import { ApolloRefetch } from "@repo/types";
import { Dispatch, SetStateAction } from "react";

export type TourProps = {
    projectId: string;
    workerId: string;
}

export type UseTourTableColumns = {
    workerId: string,
    refetch: ApolloRefetch
}

export type ServiceData = {
    objectId: string,
    name: string,
} & PropertyServices

export type TourCellProps = {
    services: ServiceData;
    id: string,
    serviceName: string,
    propertyId: string,
    propertyName: string,
    userId: string,
    refetch: ApolloRefetch
    // setAddEditService: Dispatch<SetStateAction<AddEditServiceState | null>>
}