import { PropertyService } from "@types"

export type ServiceData = {
    objectId: string,
    name: string,
} & {[key: string]: PropertyServices}