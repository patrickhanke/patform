export type IntFormikRender = {
    fields: Field[],
    data: FormDataElement,
    formSubmitHandler: (t: object) => void,
}

export type FieldTypes = 'input' | 'url' | 'number' | 'password' | 'textarea' | 'select'

export type ValidationTypes = 'string_required'

export type Field = {
    id: string
    name: string;
    type: string;
    label: string;
    position: number;
    placeholder?: string;
    initialValue?: any;
    validation?: ValidationTypes;
    dataType?: 'string'|'object'|'array';
    path?: string;
    options?: {
        number_start_value?: number;
        number_end_value?: number;
        return_type?: 'array' | 'string';
        max_file_count?: number;
    };
    select_options?: {
        label: string;
        value: string;
    }[];
}

export type FormDataElement = {[key: string]: any}
