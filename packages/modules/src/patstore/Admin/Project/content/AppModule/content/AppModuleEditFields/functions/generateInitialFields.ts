import module_fields from "../constants/module_fields";
import special_fields from "../constants/special_fields";
import { ModuleFieldsPartial } from "../types";

const generateInitialFields = (
	initialFields: ModuleFieldsPartial,
	modulePath: string
) => {
	console.log(modulePath);

	const allfields = [...module_fields, ...special_fields(modulePath)];
	console.log(allfields);

	const fields: ModuleFieldsPartial = allfields.map((field) => {
		const initialField = initialFields.find(
			(initialField) => initialField.id === field.id
		);
		if (initialField) {
			console.log(initialField);

			return {
				...field,
				active: initialField.active,
				required: initialField.required,
				position: initialField.position,
				default: initialField.default
			};
		} else {
			return field;
		}
	});

	console.log({ fields });

	return fields;
};

export default generateInitialFields;
