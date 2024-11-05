export type Params = {
    object_id: string,
    form_id: string,
    code: string
}

export type PageState = {
    value: string,
    label: string,
    disbaled?: boolean
}

export type FilterOperator = '_eq' | '_ne' | '_lt' | '_lte' | '_gt' | '_gte' | '_in' | '_nin' | '_regex' 

export type Filter = {
    key: string,
    value: string | Array<string | number>,
    operator: FilterOperator,
    id: string
}

export type ErrorMessage = {
    id: string,
    key: string,
    message: string
}

export type SelectOption = {
    value: string,
    label: string
}


