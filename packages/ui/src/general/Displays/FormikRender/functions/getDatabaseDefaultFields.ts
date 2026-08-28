import { LanguageValue, ModuleField } from "@repo/types";
import database_fields, {
	DatabaseFieldType
} from "../constants/database_fields";
import { Field } from "@repo/types";
import { languages_short } from "@repo/provider";

const getDatabaseDefaultFields = (
	fields: ModuleField[],
	languages: LanguageValue[]
): Field[] => {
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
	if (languages.length > 1) {
		formFields.push({
			id: "lang",
			name: "lang",
			label: "Sprache",
			type: "select",
			dataType: "string",
			select_options: languages.map((language) => ({
				value: language,
				label:
					languages_short.find((lng) => lng.value === language)
						?.label || language
			})),
			validation: {
				validate: true,
				required: "Pflichtfeld"
			}
		});
	}

	return formFields;
};

export default getDatabaseDefaultFields;
