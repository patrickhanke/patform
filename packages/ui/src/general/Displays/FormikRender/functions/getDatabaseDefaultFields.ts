import { ModuleField } from "@repo/types";
import database_fields from "../constants/database_fields";
import { Field } from "../types";

const getDatabaseDefaultFields = (fields: ModuleField[]) => {
	const formFields: Field[] = [];
	fields.forEach((field) => {
		if (field.required && field.active) {
			const databaseField = database_fields.find(
				(f) => f.id === field.id
			);
			if (databaseField) {
				const dataBaseFieldCopy = {
					...databaseField
				};

				if (field.required) {
					dataBaseFieldCopy.validation = {
						...dataBaseFieldCopy.validation,
						required: "Pflichtfeld"
					};
				}

				formFields.push(dataBaseFieldCopy);
			}
		}
	});

	return formFields;
};

export default getDatabaseDefaultFields;
