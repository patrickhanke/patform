import { ApolloRefetch, PropertyService } from "@types";
import { AddEditServiceState, ServiceData } from "../../types";
import { set } from 'lodash-es';
import { Dispatch, SetStateAction } from "react";

export type ServiceCellProps = {
    services: ServiceData;
    id: keyof ServiceData,
    serviceName: string,
    propertyId: string,
    propertyName: string,
    setAddEditService: Dispatch<SetStateAction<AddEditServiceState | null>>
}

export type CellContentProps = {
    service: PropertyService,
    setAddEditService: ServiceCellProps['setAddEditService'],
    serviceId: ServiceCellProps['id'],
    serviceName: ServiceCellProps['serviceName'],
    propertyId: ServiceCellProps['propertyId'],
    propertyName: ServiceCellProps['propertyName']
}