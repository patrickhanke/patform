export type fieldType =
  | "input"
  | "url"
  | "scale"
  | "number"
  | "password"
  | "textarea"
  | "image"
  | "file"
  | "editor"
  | "toggle"
  | "date"
  | "select"
  | "create_options"
  | "slider"
  | "select_and_scale"
  | "page";

export type fieldTypeWithoputPage =
  | "input"
  | "url"
  | "scale"
  | "number"
  | "password"
  | "textarea"
  | "image"
  | "file"
  | "editor"
  | "toggle"
  | "date"
  | "select"
  | "create_options"
  | "slider"
  | "select_and_scale";

export type dataTypes =
  | "string"
  | "object"
  | "boolean"
  | "number"
  | "date"
  | "pointer"
  | "array";

type dataType<T extends fieldType> = T extends
  | "input"
  | "url"
  | "password"
  | "textarea"
  | "data"
  | "editor"
  ? "string"
  : T extends "number" | "slider"
    ? "number"
    : T extends "date"
      ? "date"
      : T extends "image"
        ? "object"
        : T extends "select"
          ? "object" | "string" | "pointer"
          : undefined;

type valueType<T extends fieldType> = T extends
  | "input"
  | "url"
  | "password"
  | "textarea"
  | "data"
  | "editor"
  ? string
  : T extends "number" | "slider"
    ? number
    : T extends "image"
      ? object
      : T extends "select" | "select_and_scale"
        ? selectValues<is_multi, dataType>
        : undefined;

type optionType = {
  id: string;
  label: string;
  value: string;
};

type selectValues<
  is_multi extends boolean,
  dataType extends dataTypes,
> = is_multi extends true
  ? Array<optionType>
  : dataType extends "object"
    ? optionType
    : string;

type basicType = {
  label: string;
  value: valueType<
    formField["type"],
    formField["is_multi"],
    formField["dataType"]
  >;
  name: string;
  objectId?: string;
  type: fieldType;
  id?: string;
  placeholder?: string;
  description?: string;
  diagnostic?: {
    value: valueType<
      formField["type"],
      formField["is_multi"],
      formField["dataType"]
    >;
    comment: string;
    diagnostic_field: booelan;
  };
  options?: {
    number_start_value: number;
    number_end_value: number;
    slider_start_value: number;
    slider_end_value: number;
  };
  dataType: dataType<formField["type"]>;
  isGroup?: boolean;
  updateString?: (value: object) => void;
  props?: any;
  validation?: boolean;
  side_effect?: Array<{ field: string; value: any }>;
  disabled?: (values: FormikValues) => boolean;
  condition?: "cross_reference" | "participant";
  required?: boolean;
  position?: number;
  condition_options?: {
    question?: string;
    attribute?: "value" | "option";
    operator?: "===" | "!==" | ">" | ">=" | "<" | "<=";
    value?: string;
  };
};

type numberType = basicType & { is_inverted: boolean };

type selectType = basicType & additionalSelectType;

export type formField<T extends fieldType> = T extends "select"
  ? selectType
  : T extends "number"
    ? numberType
    : basicType;

type additionalSelectType = {
  select_options:
    | Array<{ label: string; id: string }>
    | ((values: FormikValues) => Array<{ label: string; id: string }>);
  is_multi: boolean;
  is_clearable?: boolean;
};

export type formFieldArray = (basicType | numberType | selectType)[];

export type conditionalFieldsType = {
  cond_field: keyof basicType;
  cond_type: basicType[cond_field];
  fields: formFieldArray;
};

export type pagesType = Array<pageType & { questions: Array<formField> }>;

export type pageType = {
  objectId: string;
  position: number;
  label: string;
  id: string;
  type: "page";
  description?: string;
  is_random: boolean;
  questions: Array<fieldType>;
};

export type formFieldType<T extends fieldType> = T extends "page"
  ? pageType
  : formField<T>;

export type formFieldsType = Array<formFieldType>;
