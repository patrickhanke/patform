export type TimePickerProps = {
    defaultValue: string;
    onChange: (string: string) => void;
    label: string;
    id: string;
    disabled?: boolean;
    width?: number | string;
};
