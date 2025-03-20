import { Dispatch, SetStateAction } from "react";
import { ApolloRefetch } from "@repo/types";

export type FieldOption = {
  value: string;
  label: string;
  id: string;
  text: string;
};

export type FormField = {
  id: string;
  type: string;
  name: string;
  description: string;
  options: FieldOption[];
  required: boolean;
  info: string;
  placeholder: string;
};

export type CreateFieldProps = {
  formId: string;
  fields: FormField[];
  createField: boolean;
  setCreateField: Dispatch<SetStateAction<boolean>>;
  refetch: ApolloRefetch;
  field?: FormField;
};

export type SelectTypeProps = {
  type: string;
  setType: (T: string) => void;
};

export type CreateOptionsProps = {
  options: FieldOption[];
  setOptions: (T: FieldOption[]) => void;
};

export type OptionNameProps = {
  option: FieldOption;
  onChange: (key: "label" | "text", T: string) => void;
};

export type CheckboxDescriptionProps = {
  description: string;
  setDescription: (T: string) => void;
};
