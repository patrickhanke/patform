import { FormikErrors, FormikHandlers, FormikHelpers, FormikValues } from 'formik';
import { fieldType, fieldsType, formField } from '@types';
import { TDateISODate } from '@/types/General';

export type RenderFieldsType = {
    fields: fieldsType,
    getFieldMeta: FormikHandlers['getFieldMeta'],
    handleChange: FormikHandlers['handleChange'],
    values: FormikValues,
    handleBlur: FormikHandlers['handleBlur'],
    setFieldValue: FormikHelpers<FormikValues>['setFieldValue'],
    usePages?: boolean,
    pagesState?: object,
    labelBefore?: boolean,
    diagnosticMode?: boolean,
    is_random?: boolean
}

export type Editor = {
    onChange: (value: string) => Promise<void | FormikErrors<FormikValues>>,
    value?: string | undefined,
    id?: string
}

export type ToggleType = {
    toggleState: boolean,
    toggleHandler: (value: boolean) => Promise<void | FormikErrors<FormikValues>>,
    disabled: boolean,
    labelBefore: boolean
}

export type SelectType = {
    field: formField,
    getFieldMeta: FormikHandlers['getFieldMeta'],
    getSelectValue: (values: FormikValues, field: string | object) => object | undefined,
    values: FormikValues,
    setFieldValue: FormikHelpers<FormikValues>['setFieldValue']
    disabled?: boolean
}

export type CreateOptions = {
    field: formField,
    values: FormikValues,
    setFieldValue: FormikHelpers<FormikValues>['setFieldValue']
}

export type optionType = {
    id: string,
    label: string,
    value: string
}

export type Slider = {
    field: formField,
    values: FormikValues,
    getFieldMeta: FormikHandlers['getFieldMeta'],
    setFieldValue: FormikHelpers<FormikValues>['setFieldValue'],
}

export type SelectAndScale = {
    field: formField,
    values: FormikValues,
    setFieldValue: FormikHelpers<FormikValues>['setFieldValue']
    getFieldMeta: FormikHandlers['getFieldMeta'],
    handleChange: FormikHandlers['handleChange'],
    handleBlur: FormikHandlers['handleBlur']
}

export type DatePickerType = {
    value: TDateISODate | null | undefined,
    onChange: (value: Date) => Promise<void | FormikErrors<FormikValues>>,
    labelBefore?: boolean,
    showTime?: boolean,
    showMonthDropdown?: boolean,
    showYearDropdown?: boolean,
    showAsButton?: boolean,
    isDisabled?: boolean
}

export type CustomInputType = {
    value: Date | null | undefined
}