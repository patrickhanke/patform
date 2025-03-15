import { ErrorMessage } from "@repo/types";
import {
  ActionMeta,
  GroupBase,
  MultiValue,
  OptionsOrGroups,
  SingleValue,
} from "react-select";

type Option =
  | ({ value: string | boolean | object | any; label: string } & any)
  | null;

export type SelectType = {
  onChange: (
    values: MultiValue<Option> | SingleValue<Option>,
    action?: ActionMeta<Option>
  ) => void;
  value?: MultiValue<Option> | SingleValue<Option>;
  placeholder?: string;
  options: OptionsOrGroups<Option, GroupBase<Option>> | undefined;
  isMulti?: boolean;
  isDisabled?: boolean;
  isClearable?: boolean;
  menuPosition?: "fixed" | "absolute";
  label?: string;
  errors?: ErrorMessage[];
  id?: string;
  width?: number | string;
};
