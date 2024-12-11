
export type DatePickerTypes = 'week' | 'date' | 'month' | 'time' | 'datetime-local' | 'datetime';

export type DatePickerProps = {
    defaultValue: string;
    onChange: (string: string) => void;
    type: DatePickerTypes;
    label?: string;
    id?: string;
    disabled?: boolean;
    width?: number | string;
    onlyDate?: boolean; 
    min?: string;
    max?: string;
};  