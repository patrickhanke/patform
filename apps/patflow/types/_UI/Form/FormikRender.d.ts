import { pageType } from '@/types/Test';
import { FormikHandlers, FormikHelpers, FormikValues } from 'formik';
import { fieldType, formFieldType } from './Field';

type selectType = {
    value: string;
    label: string;
};
type multiSelectType = {
    value: string;
    label: string;
};

type sliderSelectType = {
    value: string;
    label: string;
};

export type fieldsType = Array<formFieldType | pageType>;

export type ConditionalFieldsType = {
    conditionalFields: Array<conditionalFieldType>;
    getFieldMeta: FormikHandlers['getFieldMeta'];
    handleChange: FormikHandlers['handleChange'];
    values: FormikValues;
    handleBlur: FormikHandlers['handleBlur'];
    setFieldValue: FormikHelpers<FormikValues>['setFieldValue'];
};

export type IntFormikRender = {
    fields: fieldsType;
    conditionalFields?: Array<conditionalFieldType>;
    apiClass: string;
    id: string;
    entry?: string;
    path?: string;
    feedback?: string;
    afterSaveFunction?: (T: object, V: object) => void;
    isQuestionArray?: boolean;
    hasFullHeight?: boolean;
    usePages?: boolean;
    pagesState?: object;
    labelBefore?: boolean;
    diagnosticMode?: boolean;
    testMode?: boolean;
    is_random?: boolean;
    valueReturnFunction?: (FormikValues) => void;
};

export type FormSubmitStoreType = {
    fields: fieldsType;
    submitForm: (value: object) => Promise<typeof value>;
    apiClass: string;
    id: string;
    entry?: string;
    path?: string;
    feedback?: string;
    afterSaveFunction?: IntFormikRender['afterSaveFunction'];
    isQuestionArray: boolean;
    diagnosticMode?: boolean;
    testMode?: boolean;
    usePages?: booelean;
    values: { [id: string]: any };
    valueReturnFunction?: IntFormikRender['valueReturnFunction'];
};
