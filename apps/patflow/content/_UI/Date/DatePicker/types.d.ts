export type DatePickerProps = {
    defaultValue: string;
    onChange: (string: string) => void;
    type: 'week' | 'date' | 'month' | 'time' | 'datetime-local' | 'datetime';
    label: string;
    id: string;
    disabled?: boolean;
    width?: number | string;
    onlyDate?: boolean;
    min?: string;
    max?: string;
};
