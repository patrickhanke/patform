import { Dispatch, SetStateAction } from "react"

export type ToursProps = {
    projectId: string, 
    setPageHeaderContent: Dispatch<SetStateAction<ReactNode | null>>
}

export type UseTourTableColumns = {
    workerId: string,
    refetch: ApolloRefetch
}