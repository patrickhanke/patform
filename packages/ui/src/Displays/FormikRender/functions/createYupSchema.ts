import { CreateYupSchemaFunction } from "../types";
import * as Yup from "yup";

const createYupSchema: CreateYupSchemaFunction = (type, validation) => {
  let method:
    | Yup.StringSchema
    | Yup.NumberSchema
    | Yup.ArraySchema<any[], Yup.AnyObject, undefined, ""> = Yup.string();
  if (validation) {
    if (type === "input" || type === "url" || type === "textarea") {
      method = Yup.string()
        .required(validation?.required || undefined)
        .min(
          validation?.min_length ? validation.min_length : 0,
          `Die Mindestlänge beträgt ${validation?.min_length}`
        )
        .max(
          validation?.max_length ? validation.max_length : 10000,
          `Die Höchstlänge beträgt ${validation?.max_length}`
        );
    }
    if (type === "number") {
      method = Yup.number()
        .required(validation?.required || undefined)
        .min(
          validation?.min_value ? validation.min_value : 0,
          `Der Mindestwert beträgt ${validation?.min_value}`
        )
        .max(
          validation?.max_value ? validation.max_value : 10000,
          `Der Höchstwert beträgt ${validation?.max_value}`
        );
    }
    if (type === "persons_select") {
      method = Yup.array().required(validation?.required || undefined);
    }
  }

  return method;
};

export default createYupSchema;
