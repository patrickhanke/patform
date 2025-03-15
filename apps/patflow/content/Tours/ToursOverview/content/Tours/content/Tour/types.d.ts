import { ApolloRefetch } from "@repo/types";
import { Dispatch, SetStateAction } from "react";

export type TourProps = {
  projectId: string;
  workerId: string;
  year: number;
};

export type UseTourTableColumns = {
  workerId: string;
  refetch: ApolloRefetch;
  year: number;
};

export type ServiceData = {
  objectId: string;
  name: string;
} & PropertyServices;

export type TourCellProps = {
  services: ServiceData;
  id: string;
  serviceName: string;
  propertyId: string;
  propertyName: string;
  userId: string;
  refetch: ApolloRefetch;
  year: number;
  // setAddEditService: Dispatch<SetStateAction<AddEditServiceState | null>>
};
