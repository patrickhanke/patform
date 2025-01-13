import { FormikHelpers, FormikValues } from 'formik';
import { Field } from './Fields';
import { FormikRenderComponent } from './General';

export type FormScaleComponent= {
    field: Field<'field'> & {type: 'scale'},
    values: FormikValues,
    setFieldValue: FormikHelpers['setFieldValue']
}

export type FormCheckboxContainer= {
    option: {id: string, label: string},
    value: string,
    valueChangeHandler: () => void
}

export type FormSelectAndScaleComponent = {
    field: Field<'field'> & {type: 'select_and_scale'},
    value: [T: string, N: number],
    setFieldValue: FormikHandlers['setFieldValue']
}

export type FilesInterfaceComponent = {
    files: {url: string, name: string}[],
    fieldName: Field<'field'>['name'],
    apiClass: FormikRenderComponent['apiClass'],
    id: FormikRenderComponent['id'],
    afterSaveHandler: FormikRenderComponent['afterSaveFunction']
}