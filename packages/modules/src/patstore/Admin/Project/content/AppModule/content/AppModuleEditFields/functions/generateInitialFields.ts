import default_fields from "../constants/default_fields";
import module_fields from "../constants/module_fields";
import special_fields from "../constants/special_fields";
import { ModuleFieldsPartial } from "../types";
import { Module } from "@repo/types";

const generateInitialFields = (
	initialFields: ModuleFieldsPartial,
	modulePath: Module["path"]
) => {
	const allfields = [...module_fields, ...special_fields(modulePath)];

	const fields: ModuleFieldsPartial = allfields.map((field) => {
		const initialField = initialFields.find(
			(initialField) => initialField.id === field.id
		);
		if (initialField) {
			console.log(initialField);
			const isDefault = default_fields[modulePath]?.includes(field.id);
			console.log({ isDefault });

			return {
				...field,
				active: isDefault || initialField.active,
				required: initialField.required,
				position: initialField.position,
				default: isDefault || initialField.default
			};
		} else {
			return field;
		}
	});

	console.log({ fields });

	return fields;
};

export default generateInitialFields;
