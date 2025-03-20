export type FieldType =
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

type Values<T extends FieldType> = T extends
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

type FieldBasic = {
  name: string;
  label: string;
  id?: string;
  objectId: string;
  placeholder?: string;
  description?: string;
  is_inverted?: boolean;
  scale_id: string;
  factor_id: string;
  diagnostic?: {
    value: valueType<
      formField["type"],
      formField["is_multi"],
      formField["dataType"]
    >;
    comment: string;
    diagnostic_field: booelan;
  };
  updateString?: (value: object) => void;
  props?: any;
  validation?: boolean;
  disabled?: (values: FormikValues) => boolean;
  required?: boolean;
  position?: number;
  condition?: "cross_reference" | "participant";
  side_effect?: Array<{ field: string; value: any }>;
  condition_options?: {
    question?: string;
    attribute?: "value" | "option";
    operator?: "===" | "!==" | ">" | ">=" | "<" | "<=";
    value?: string;
  };
};

type SelectOption = {
  id: string;
  label: string;
  value: string;
};

type SelectValues<
  is_multi extends boolean,
  dataType extends dataTypes,
> = is_multi extends true
  ? Array<SelectOption>
  : dataType extends "object"
    ? SelectOption
    : string;

export type Field<T> = T extends "page"
  ? {
      name: string;
      objectId: string;
      position: number;
      label: string;
      id: string;
      objectId: string;
      type: "page";
      description?: string;
      is_random: boolean;
      questions: Array<fieldType>;
    }
  :
      | (FieldBasic & {
          type: "input" | "url" | "password" | "textarea" | "data" | "editor";
          value: string;
          dataType: string;
        })
      | (FieldBasic & {
          type: "number" | "slider";
          value: number;
          dataType: number;
          step?: number;
          options: {
            number_start_value: number;
            number_end_value: number;
          };
        })
      | (FieldBasic & {
          type: "image" | "file";
          value: object;
          dataType: object;
        })
      | (FieldBasic & { type: "files"; value: array; dataType: array })
      | (FieldBasic & { type: "toggle"; value: boolean; dataType: boolean })
      | (FieldBasic & { type: "date"; value: string; dataType: object })
      | (FieldBasic & {
          type: "create_options";
          value: Array[{ label: string; id: string }];
          dataType: "array";
        })
      | (FieldBasic & {
          type: "pointerselect";
          value: string | object;
          dataType: {
            __type: "Pointer";
            className: string;
            objectId: string;
          };
          options: {
            select_options: Array<SelectOption>;
          };
        })
      | (FieldBasic & {
          type: "select";
          value: Array<SelectOption> | SelectOption | string;
          dataType: object | string;
          is_multi: boolean;
          options: {
            select_options: Array<SelectOption>;
          };
        })
      | (FieldBasic & {
          type: "select_and_scale";
          value: Array<>;
          dataType: Array<string, number>;
          options: {
            select_options: Array<SelectOption>;
            scale_start_value: number;
            scale_end_value: number;
            scale_start_label: string;
            scale_end_label: string;
            scale_label: string;
          };
        })
      | (FieldBasic & {
          type: "scale";
          value: number;
          dataType: number;
          options: {
            scale_start_value: number;
            scale_end_value: number;
            scale_start_label: string;
            scale_end_label: string;
          };
        });

export type ConditionalFieldType = {
  type: "";
};

export type ConditionalField = {
  cond_field: string;
  cond_type: "cross_reference" | "participant";
  fields: Field[];
};
