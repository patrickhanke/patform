import { Module } from "@repo/types";
import { ColumnClasses, ColumnData, ColumnDataTypes } from "../types";

const checkField = (field: Module["fields"][number]) => {
	if (field.type === "string" || field.type === "edit_string") {
		return true;
	}
	if (field.type === "number") {
		return true;
	}
	if (field.type === "date" || field.type === "edit_date") {
		return true;
	}
	if (field.type === "boolean") {
		return true;
	}
	if (field.type === "location") {
		return true;
	}
	// if (field.type === "image") {
	// 	return true;
	// }
	return false;
};

const generateColumnsFromFields = <T extends ColumnClasses>(
	fields: Module["fields"]
): ColumnData<T>[] => {
	const fieldArray: ColumnData<T>[] = [];

	fields.forEach((field) => {
		if (field.active && checkField(field)) {
			fieldArray.push({
				id: field.id,
				label: field.label,
				type: field.type as ColumnDataTypes,
				enableSorting: true,
				sortingFn: undefined
			});
		}
	});

	return fieldArray;
};

export default generateColumnsFromFields;
