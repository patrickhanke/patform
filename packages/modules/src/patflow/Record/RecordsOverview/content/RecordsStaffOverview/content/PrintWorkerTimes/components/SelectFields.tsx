import { CheckboxGroup } from "@repo/ui";
import fields from "../constants/fields";
import { SelectFieldsProps } from "../types";
import { FC } from "react";

const SelectFields: FC<SelectFieldsProps> = ({ setFields }) => {
	return <CheckboxGroup items={fields} onChange={setFields} />;
};

export default SelectFields;
