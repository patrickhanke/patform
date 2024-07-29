export type IntFormikRender = {
    fields: Field[],
    data: FormDataElement,
    formSubmitHandler: (t: object) => void,
}

export type FieldTypes = 'input' | 'url' | 'number' | 'password' | 'textarea' | 'select'

export type Field = {
    id: string
    name: string;
    type: string;
    label: string;
    position: number;
    required: boolean;
    placeholder?: string;
    initialValue?: any;
    validation?: any;
    dataType?: 'string'|'object'|'array';
    options?: {
        number_start_value?: number;
        number_end_value?: number;
    };
    select_options?: {
        label: string;
        value: string;
    }[];


}

export type FormDataElement = {[key: string]: any}
