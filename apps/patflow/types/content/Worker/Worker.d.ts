import { User } from "@repo/types"

export type Worker = {
    objectId: string, 
    first_name: string,
    family_name: string,
    email: string, 
    portrait: ApplicationTypes.Image, 
    created_by?: User
    time_settings?: User['time_settings'],
}

export type WorkerSelect = {
    value: string,
    id: string,
    label: string,
    portrait: ApplicationTypes.Image
}