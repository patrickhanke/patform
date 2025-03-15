import { FormikHandlers, FormikHelpers, FormikValues } from "formik";
import { ConditionalField, Field } from "./Fields";
import { TestType } from "@/types/Test";

export type FormikRenderComponent = {
  fields: fieldsType;
  conditionalFields?: Array<conditionalFieldType>;
  apiClass?: string;
  id?: string;
  entry?: string;
  path?: string;
  feedback?: string;
  afterSaveFunction?: (T?: object, V?: any) => void;
  isQuestionArray?: boolean;
  hasFullHeight?: boolean;
  usePages?: boolean;
  pagesState?: FormPage;
  labelBefore?: boolean;
  diagnosticMode?: boolean;
  testMode?: boolean;
  is_random?: boolean;
  valueReturnFunction?: (FormikValues) => void;
};

export type ConditionalFieldsComponent = {
  conditionalFields: Array<ConditionalField>;
  getFieldMeta: FormikHandlers["getFieldMeta"];
  handleChange: FormikHandlers["handleChange"];
  values: FormikValues;
  handleBlur: FormikHandlers["handleBlur"];
  setFieldValue: FormikHelpers<FormikValues>["setFieldValue"];
  fields: Field[];
};

export type FormPage = {
  position: number;
  description: string;
  id: string;
  is_random?: number;
  label: string;
  name: string;
  objectId: string;
  questions: Array<Field>;
  test: TestType;
};

export type RenderFieldsComponent = {
  fields: Array<Field>;
  getFieldMeta: FormikHandlers["getFieldMeta"];
  handleChange: FormikHandlers["handleChange"];
  values: FormikValues;
  handleBlur: FormikHandlers["handleBlur"];
  setFieldValue: FormikHelpers<FormikValues>["setFieldValue"];
  usePages?: boolean;
  pagesState?: FormPage;
  labelBefore?: boolean;
  diagnosticMode?: boolean;
  is_random?: boolean;
  apiClass: FormikRenderComponent["apiClass"];
  id: FormikRenderComponent["id"];
  afterSaveFunction: FormikRenderComponent["afterSaveFunction"];
};
