import React from "react";

import { FormikHandlers, FormikHelpers, FormikValues } from "formik";
import { Field } from "../../types";
import { Dispatch, SetStateAction } from "react";
import { DatePickerTypes } from "@repo/ui";

export type RenderFieldsType = {
  fields: Field[];
  getFieldMeta: FormikHandlers["getFieldMeta"];
  handleChange: FormikHandlers["handleChange"];
  values: FormikValues;
  handleBlur: (t: any) => void;
  setFieldValue: FormikHelpers<{
    field: string;
    value: any;
    shouldValidate?: boolean;
  }>["setFieldValue"];
  isHorizontal?: boolean;
  apiClass?: string;
  id?: string;
  setSecondaryContent?: Dispatch<SetStateAction<React.ReactNode | null>>;
  highlightChanges: boolean;
  afterSaveFunction?: (T?: object, V?: any) => void;
};

export type Editor = {
  onChange: () => void;
  value?: string | undefined;
  label?: string;
  width?: string;
};

export type ToggleType = {
  toggleState: boolean;
  toggleHandler: (t: boolean) => void;
  disabled: boolean;
  label: string | undefined;
  labelBefore: boolean;
};

export type DatePickerFieldProps = {
  value: string;
  onChange: (e: string) => void;
  type: DatePickerTypes;
};

export type CustomInputType = {
  value: Date | null | undefined;
};

export type ColorPickerProps = {
  value: string;
  onChange: (value: string) => void;
  label: string;
  isOverlay?: boolean;
  isHorizontal?: boolean;
};

export type SelectToggleProps = {
  value: boolean;
  valueChangeHandler: (value: boolean) => void;
  disabled: boolean;
  labelBefore: boolean;
};
