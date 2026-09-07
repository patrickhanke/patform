import { ErrorMessage, Filter, Module } from "@repo/types";
import { ARRAY_OPERATORS } from "../constants/filterOperators";
import {
	SEARCH_FILTER_KEY,
	decodeSearchValue,
	getFieldType
} from "./getFilterFieldOptions";

const isEmptyValue = (value: Filter["value"]): boolean => {
	if (value === "" || value === null || value === undefined) {
		return true;
	}

	if (Array.isArray(value)) {
		return value.length === 0;
	}

	return false;
};

const validateEditFilters = (
	filters: Filter[],
	userModule: Module
): ErrorMessage[] => {
	const errors: ErrorMessage[] = [];
	const seen = new Set<string>();

	filters.forEach((filter, index) => {
		const id = filter.id || String(index);
		const fieldType = getFieldType(userModule, filter.key);
		const needsTemplate = fieldType === "search" || fieldType === "pointer";

		if (!filter.key) {
			errors.push({
				id: `${id}-key`,
				key: `${id}-key`,
				message: "Feld ist erforderlich"
			});
		} else {
			const identity = `${filter.key}:${filter.operatorTemplate || ""}`;
			if (seen.has(identity)) {
				errors.push({
					id: `${id}-key`,
					key: `${id}-key`,
					message: "Dieser Filter existiert bereits"
				});
			} else {
				seen.add(identity);
			}
		}

		if (!filter.operator) {
			errors.push({
				id: `${id}-operator`,
				key: `${id}-operator`,
				message: "Operator ist erforderlich"
			});
		}

		if (needsTemplate && !filter.operatorTemplate) {
			errors.push({
				id: `${id}-operatorTemplate`,
				key: `${id}-operatorTemplate`,
				message: "Operator-Template ist erforderlich"
			});
		}

		if (typeof filter.value !== "boolean" && isEmptyValue(filter.value)) {
			errors.push({
				id: `${id}-value`,
				key: `${id}-value`,
				message: "Wert ist erforderlich"
			});
		} else if (filter.key === SEARCH_FILTER_KEY) {
			const decodedValue = decodeSearchValue(
				filter.operatorTemplate || "",
				filter.value
			);
			if (
				typeof decodedValue !== "boolean" &&
				isEmptyValue(decodedValue)
			) {
				errors.push({
					id: `${id}-value`,
					key: `${id}-value`,
					message: "Wert ist erforderlich"
				});
			}
		}

		if (
			ARRAY_OPERATORS.includes(filter.operator) &&
			!Array.isArray(filter.value)
		) {
			errors.push({
				id: `${id}-value`,
				key: `${id}-value`,
				message: "Wert muss eine Liste sein"
			});
		}
	});

	return errors;
};

export default validateEditFilters;
