import {
	CategoryClass,
	Field,
	LanguageValue,
	ModuleCategory,
	ModuleField
} from "@repo/types";
import database_fields, {
	DatabaseFieldType
} from "../constants/database_fields";
import { languages_short } from "@repo/provider";

type CategoryRecord = CategoryClass & {
	category_id?: string;
};

const categorySelectOptions = (
	category: ModuleCategory,
	categoryRecords: CategoryRecord[] = []
) => {
	if (category.connected_class !== "Category") {
		return [];
	}

	const categoryIds = category.category_ids || [];
	const records =
		categoryIds.length > 0
			? categoryRecords.filter(
					(record) =>
						!!record.category_id &&
						categoryIds.includes(record.category_id)
				)
			: categoryRecords;

	return records
		.map((record) => ({
			label: record.label || record.title || record.objectId,
			value: record.objectId
		}))
		.sort((a, b) => a.label.localeCompare(b.label, "de"));
};

const getDatabaseDefaultFields = (
	fields: ModuleField[],
	languages?: LanguageValue[],
	categories?: ModuleCategory[],
	categoryRecords?: CategoryRecord[]
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

		const fieldObject: Field = {
			...databaseField,
			id: field.id,
			name: field.id,
			label: field.label,
			validation: {
				validate: field.required,
				required: "Pflichtfeld"
			}
		};

		if (fieldObject.type === "select" && field.select_options) {
			fieldObject.select_options = field.select_options;
		}

		formFields.push(fieldObject);
	});

	categories?.forEach((category) => {
		if (category.is_required !== true) {
			return;
		}

		formFields.push({
			id: category.id,
			name: category.id,
			label: category.label,
			type: "select",
			dataType: "string",
			isMulti: category.is_multi,
			width: "100%",
			select_options: categorySelectOptions(category, categoryRecords),
			validation: {
				validate: true,
				required: "Pflichtfeld"
			}
		});
	});

	if (languages && languages?.length > 1) {
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
