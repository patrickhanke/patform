import * as Yup from 'yup';
import { FormikValues } from 'formik';
import {Dispatch, SetStateAction} from 'react';

export type  handleFormData<V extends FormDataElement> = (data: V) => void

export type IntFormikRender = {
    fields: Field[],
    data: FormDataElement,
    formSubmitHandler: (values: FormikValues) => void,
    formValidationHandler?: (t: boolean) => void,
    useWithDebounce?: boolean,
    isHorizontal?: boolean,
    setSecondaryContent?: Dispatch<SetStateAction<React.ReactNode | null>>
}

export type FormSubmitStoreProps = {
    formValidationHandler?: (t: boolean) => void,
    useWithDebounce?: boolean
}

export type FieldTypes = 'input' | 'url' | 'number' | 'password' | 'textarea' | 'select' | 'image' |'file' | 'color' | 'toggle' | 'texteditor' | 'pointer_select'

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

export type BasicField = {
    id: string;
    name: string;
    label: string;
    position?: number;
    placeholder?: string;
    initialValue?: any;
    validation?: {
        required?: string;
    }
}

export type FieldType = {
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
        pointer_type?: string;
    };
    select_options?: {
        label: string;
        value: string;
    }[];
}

export type StringField = 
    BasicField & {
        type: 'input' | 'url' | 'password' | 'textarea' | 'texteditor';
        validation: {
            required?: string;
            min_length?: number;
            max_length?: number;
            email?: boolean;
            url?: boolean;
            number?: boolean;
            password?: boolean;
        }
    }


export type ToggleField = 
    BasicField & {
        type: 'toggle';
        validation: {
            required?: string;
        }
    }

export type NumberField =
    BasicField & {
        type: 'number';
        validation: {
            required?: string;
            min_value?: number;
            max_value?: number;
            number?: boolean;
        }
    }


export type ImageField =
    BasicField & {
        type: 'image';
        options: {
            return_type: 'array' | 'string';
            max_file_count: number
        };
        validation: {
            required?: string;
            max_file_count?: number;
        }
    }

export type FileField =
    BasicField & {
        type: 'file';
        validation: {
            required?: string;
            max_file_count?: number;
        }
    }

export type SelectField =
    BasicField & {
        type: 'select';
        dataType: 'string' | 'object';
        select_options: {label: string, value: string}[]
    }

export type PointerSelectField =
    BasicField & {
        type: 'pointer_select';
        select_options: {label: string, value: string}[]
        options : {
            pointer_class: string;
        }
    }

export type ColorField =
    BasicField & {
        type: 'color';
        validation: {
            required?: string;
        }
    }
        

export type Field = StringField | ToggleField | NumberField | ImageField | FileField | SelectField | PointerSelectField | ColorField

export type FieldValidationArray = Array<Field & {validation: ValidationTypes}>

export type getFieldsWithValidationFunction = (fields: Field[]) => FieldValidationArray

export type CreateYupSchemaFunction = (type: Field['type'], validation: Field['validation']) => Yup.ISchema<any, any, any, any> | Yup.Reference<unknown>

export type FormDataElement = {[key: string]: any}
