import { Module } from "@repo/types";
import { ColumnClasses, ColumnData } from "../types";

const generateColumnsFromFields = <T extends ColumnClasses>(
	fields: Module["fields"]
): ColumnData<T>[] => {
	const fieldArray: ColumnData<T>[] = [];

	fields.forEach((field) => {
		if (field.active) {
			fieldArray.push({
				id: field.id,
				label: field.label,
				type: field.type,
				enableSorting: true,
				sortingFn: undefined
			});
		}
	});

	return fieldArray;
};

export default generateColumnsFromFields;
