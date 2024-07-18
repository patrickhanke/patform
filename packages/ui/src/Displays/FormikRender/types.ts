export type FieldsType = Array<{
    name: string, 
    initialValue: any, 
    validation: any, 
    id: string, 
    placeholder: string, 
    type: string, 
    label: string, 
    options: Array<{value: string, label: string}>,
    dataType: string
}>

export type IntFormikRender = {
    fields: FieldsType,
    formSubmitHandler: (t: object) => void,
}
