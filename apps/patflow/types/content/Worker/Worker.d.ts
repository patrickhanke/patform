export type Worker = {
    objectId: string, 
    first_name: string,
    family_name: string,
    email: string, 
    portrait: ApplicationTypes.Image, 
    created_by?: UserTypes.User
}

export type WorkerSelect = {
    value: string,
    id: string,
    label: string,
    portrait: ApplicationTypes.Image
}