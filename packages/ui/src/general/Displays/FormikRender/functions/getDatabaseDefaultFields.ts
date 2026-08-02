import { ModuleField } from "@repo/types";
import database_fields, {
	DatabaseFieldType
} from "../constants/database_fields";
import { Field } from "@repo/types";

const getDatabaseDefaultFields = (fields: ModuleField[]): Field[] => {
	const formFields: Field[] = [];

	fields.forEach((field) => {
		if (!(field.required && field.active)) {
			return;
		}

		if (!(field.type in database_fields)) {
			return;
		}

		const databaseField = database_fields[
			field.type as DatabaseFieldType
		] as Field;
		formFields.push({
			...databaseField,
			id: field.id,
			name: field.id,
			label: field.label,
			validation: {
				validate: field.required,
				required: "Pflichtfeld"
			}
		});
	});

	return formFields;
};

export default getDatabaseDefaultFields;
