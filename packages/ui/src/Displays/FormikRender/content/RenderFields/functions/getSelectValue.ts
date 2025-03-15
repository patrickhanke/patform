import { FormikValues } from "formik";
import { SelectField } from "../../../types";

const getSelectValue = (values: FormikValues, field: SelectField) => {
  if (typeof values[field.name] === "string") {
    return (
      field.select_options.find(
        (option) => option.value === values[field.name]
      ) ||
      field.select_options.find((option) => option.label === values[field.name])
    );
  }
  if (typeof values[field.name] === "object") {
    return values[field.name];
  }
  return undefined;
};

export default getSelectValue;
