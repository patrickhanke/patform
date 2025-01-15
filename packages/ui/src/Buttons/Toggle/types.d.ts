import { ApolloRefetch } from "@repo/types"

export type ToggleType = 'get_service_active' | 'is_worker'

export type StatelessToggleProps = { 
    onChange: (value: boolean) => void, 
    value: boolean, 
    disabled?: boolean ,
    label?: string
}


export type ToggleProps = {
    value: boolean
    onClick?: (value: boolean) => void,
    refetch?: ApolloRefetch,
    objectId?: string, 
    className?: string, 
    key?: string | number | symbol, 
}
