import { ApolloRefetch, PropertyService } from "@types"

export type ServiceData = {
    objectId: string,
    name: string,
} & PropertyServices

export type AddEditServiceState = {
    serviceId: string,
    serviceName: string,
    propertyId: string,
    propertyName: string,
} & PropertyService

export type UseServiceTableColumns = {
    refetch: ApolloRefetch,
    addEditService: AddEditServiceState | null,
    setAddEditService: Dispatch<SetStateAction<AddEditServiceState | null>>
}