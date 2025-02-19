import { ApolloRefetch } from "@types";
import { ServiceData } from "../../types";

export type ServiceCellProps = {
    services: ServiceData;
    id: string,
    serviceName: string,
    propertyId: string,
    refetch: ApolloRefetch
}