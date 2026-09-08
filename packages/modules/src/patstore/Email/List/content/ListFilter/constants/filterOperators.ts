import { FilterOperator } from "@repo/types";

export type FilterOperatorOption = {
	value: FilterOperator;
	label: string;
};

const filterOperators = (fieldType: string): FilterOperatorOption[] => {
	switch (fieldType) {
		case "string":
			return [
				{ value: "matchesRegex", label: "Enthält" },
				{ value: "equalTo", label: "Ist gleich" },
				{ value: "notEqualTo", label: "Ist ungleich" },
				{ value: "in", label: "Ist eines von" },
				{ value: "exists", label: "Existiert" }
			];
		case "number":
			return [
				{ value: "equalTo", label: "Ist gleich" },
				{ value: "notEqualTo", label: "Ist ungleich" },
				{ value: "lessThan", label: "Kleiner als" },
				{ value: "lessThanOrEqualTo", label: "Kleiner oder gleich" },
				{ value: "greaterThan", label: "Größer als" },
				{ value: "greaterThanOrEqualTo", label: "Größer oder gleich" }
			];
		case "pointer":
			return [
				{ value: "have", label: "Hat" },
				{ value: "haveNot", label: "Hat nicht" }
			];
		case "id":
			return [
				{ value: "equalTo", label: "Ist gleich" },
				{ value: "in", label: "Ist eines von" }
			];
		case "ids":
			return [{ value: "in", label: "Ist eines von" }];
		case "boolean":
			return [
				{ value: "equalTo", label: "Ist gleich" },
				{ value: "notEqualTo", label: "Ist ungleich" }
			];
		case "search":
			return [
				{ value: "equalTo", label: "Ist gleich" },
				{ value: "matchesRegex", label: "Enthält" },
				{ value: "exists", label: "Existiert" }
			];
		default:
			return [];
	}
};

export const ARRAY_OPERATORS: FilterOperator[] = ["in", "notIn", "containedIn"];

export default filterOperators;
