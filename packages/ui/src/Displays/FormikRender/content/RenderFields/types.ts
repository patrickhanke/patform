import { FormikHandlers, FormikHelpers, FormikValues } from 'formik';
import { Field } from '../../types';

export type RenderFieldsType = {
    fields: Field[],
    getFieldMeta: FormikHandlers['getFieldMeta'],
    handleChange: FormikHandlers['handleChange'],
    values: FormikValues,
    handleBlur: (t: any) => void,
    setFieldValue: FormikHelpers<{field: string, value: any, shouldValidate?: boolean}>['setFieldValue'],
    isHorizontal?: boolean
}

export type Editor = {
    onChange: () => void,
    value?: string | undefined,
    label?: string,
    width?: string
}

export type ToggleType = {
    toggleState: boolean,
    toggleHandler: (t: boolean) => void,
    disabled: boolean,
    label: string | undefined,
    labelBefore: boolean
}

export type DatePickerType = {
    value: Date | null | undefined,
    onChange: () => void,
    labelBefore?: boolean,
    label?: string,
    showTime?: boolean,
    showMonthDropdown?: boolean,
    showYearDropdown?: boolean,
    showAsButton?: boolean,
    isDisabled?: boolean
}

export type CustomInputType = {
    value: Date | null | undefined
}