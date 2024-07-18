export type ToggleType = 'get_service_active' | 'is_worker'

export type StatelessToggleProps = { 
    onChange: (value: boolean) => void, 
    value: boolean, 
    disabled?: boolean ,
    label?: string
}
