
export type FieldTypes = 'input' | 'url' | 'number' | 'password' | 'textarea' | 'select'

export type Field = {
    id: string
    name: string;
    type: string;
    label: string;
    position: number;
    required: boolean;
    options?: {
        number_start_value?: number;
        number_end_value?: number;
    };

}