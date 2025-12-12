import default_fields from "../constants/default_fields";
import disabled_fields from "../constants/disabled_fields";
import module_fields from "../constants/module_fields";
import special_fields from "../constants/special_fields";
import { ModuleFieldsPartial } from "../types";
import { Module, ModuleField } from "@repo/types";

const generateInitialFields = (
	initialFields: ModuleFieldsPartial,
	modulePath: Module["path"]
) => {
	const generateFields = () => {
		const allFieldsArray = [
			...special_fields(modulePath),
			...module_fields
		];
		const fieldArray: ModuleField[] = [];

		allFieldsArray.forEach((field) => {
			if (!fieldArray.find((f) => f.id === field.id)) {
				fieldArray.push(field);
			}
		});
		const filteredFieldArray = fieldArray.filter(
			(field) => !disabled_fields[modulePath]?.includes(field.id)
		);

		return filteredFieldArray;
	};
	const allfields = generateFields();

	const fields: ModuleFieldsPartial = allfields.map((field) => {
		const initialField = initialFields.find(
			(initialField) => initialField.id === field.id
		);
		if (initialField) {
			const isDefault = default_fields[modulePath]?.includes(field.id);

			return {
				...field,
				active: isDefault ? true : initialField.active,
				required: initialField.required,
				position: initialField.position,
				default: isDefault,
				disabled: isDefault
			};
		} else {
			return field;
		}
	});

	return fields;
};

export default generateInitialFields;
