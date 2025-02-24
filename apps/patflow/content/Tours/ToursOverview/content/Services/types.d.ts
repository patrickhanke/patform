import { ApolloRefetch, PropertyService } from "@types"

export type ServiceData = {
    objectId: string,
    name: string,
} & Property['services']

export type AddEditServiceState = {
    serviceId: string,
    serviceName: string,
    propertyId: string,
    propertyName: string,
} & PropertyService

export type UseServiceTableColumns = {
    setAddEditService: Dispatch<SetStateAction<AddEditServiceState | null>>
}