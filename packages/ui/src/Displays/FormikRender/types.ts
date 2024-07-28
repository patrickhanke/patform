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
    options?: {
        number_start_value?: number;
        number_end_value?: number;
    };

}

export type FormDataElement = {[key: string]: any}
