import { ErrorMessage } from "@repo/types";
import { ListFilterItem, ListFilterValue } from "../types";

type ValidateListFilterParams = {
	key: string;
	value: ListFilterValue | "";
	existingFilters: ListFilterItem[];
};

const validateListFilter = ({
	key,
	value,
	existingFilters
}: ValidateListFilterParams): ErrorMessage[] => {
	const errors: ErrorMessage[] = [];

	if (!key) {
		errors.push({
			id: "key",
			key: "key",
			message: "Feld ist erforderlich"
		});
	}

	if (key && existingFilters.some((filter) => filter.key === key)) {
		errors.push({
			id: "key",
			key: "key",
			message: "Filter für dieses Feld existiert bereits"
		});
	}

	if (typeof value !== "boolean" && (value === "" || value === undefined)) {
		errors.push({
			id: "value",
			key: "value",
			message: "Wert ist erforderlich"
		});
	}

	return errors;
};

export default validateListFilter;
