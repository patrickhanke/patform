import { ApolloRefetch, PropertyService } from "@repo/types";

export type ServiceData = {
  objectId: string;
  name: string;
} & { [key: string]: PropertyServices };

export type AddEditServiceState = {
  serviceId: string;
  serviceName: string;
  propertyId: string;
  propertyName: string;
} & PropertyService;

export type UsePropertyTableColumns = {
  refetch: ApolloRefetch;
  addEditService: AddEditServiceState | null;
  setAddEditService: Dispatch<SetStateAction<AddEditServiceState | null>>;
};
