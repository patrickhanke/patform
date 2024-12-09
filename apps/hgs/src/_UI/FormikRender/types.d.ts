import { FormikHandlers, FormikHelpers, FormikValues } from 'formik';
import { ConditionalField, Field } from './Fields';

export type FormikRenderComponent = {
    fields: fieldsType,
    conditionalFields?: Array<conditionalFieldType>,
    apiClass?: string,
    id?: string,
    valueReturnFunction?: (T?: object, V?: any) => void,
    formValidationHandler?: (t: boolean) => void,
    useWithDebounce?: boolean,
    afterSaveFunction?: (T?: object, V?: any) => void,
    hasFullHeight?: boolean,
    pagesState?: FormPage,
    labelBefore?: boolean,
    enableReinitialize?: boolean,
    highlightChanges?: boolean
}

export type ConditionalFieldsComponent = {
    conditionalFields: Array<ConditionalField>,
    getFieldMeta: FormikHandlers['getFieldMeta'],
    handleChange: FormikHandlers['handleChange'],
    values: FormikValues,
    handleBlur: FormikHandlers['handleBlur'],
    setFieldValue: FormikHelpers<FormikValues>['setFieldValue']
    fields: Field[],
    highlightChanges: boolean
}

export type ConditionalFieldType = {
    type: ''
}

export type ConditionalField = {
    cond_field: string,
    cond_type: 'cross_reference' | 'participant',
    fields: Field[]
}

export type FormSubmitStoreProps = {
    formValidationHandler?: (t: boolean) => void,
    useWithDebounce?: boolean
}