import { generateUuid } from "@repo/provider";
import { FormField } from "../types";

const default_field_data: FormField = {
  id: generateUuid(),
  name: "",
  type: "",
  required: false,
  options: [],
  info: "",
  description: "",
  placeholder: "",
};

export default default_field_data;
