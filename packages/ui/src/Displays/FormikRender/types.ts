import * as Yup from 'yup';
import { FormikValues } from 'formik';

export type  handleFormData<V extends FormDataElement> = (data: V) => void

export type IntFormikRender = {
    fields: Field[],
    data: FormDataElement,
    formSubmitHandler: (values: FormikValues) => void,
    formValidationHandler?: (t: boolean) => void,
    useWithDebounce?: boolean,
    isHorizontal?: boolean
}

export type FormSubmitStoreProps = {
    formValidationHandler?: (t: boolean) => void,
    useWithDebounce?: boolean
}

export type FieldTypes = 'input' | 'url' | 'number' | 'password' | 'textarea' | 'select' | 'image' |'file' | 'color' | 'toggle'

export type ValidationTypes = {
    required?: string;
    min_length?: number;
    max_length?: number;
    min_value?: number;
    max_value?: number;
    email?: boolean;
    url?: boolean;
    number?: boolean;
    password?: boolean;
}

export type Field = {
    id: string
    name: string;
    type: FieldTypes;
    label: string;
    position?: number;
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

export type FieldValidationArray = Array<Field & {validation: ValidationTypes}>

export type getFieldsWithValidationFunction = (fields: Field[]) => FieldValidationArray

export type CreateYupSchemaFunction = (type: Field['type'], validation: Field['validation']) => Yup.ISchema<any, any, any, any> | Yup.Reference<unknown>

export type FormDataElement = {[key: string]: any}
