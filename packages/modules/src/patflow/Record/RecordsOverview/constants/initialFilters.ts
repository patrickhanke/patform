import { Filter } from "@repo/types";

const initialFilters: (year?: number) => Filter[] = (year) => [
	{
		key: "year",
		operator: "equalTo",
		value: year || new Date().getFullYear()
	}
];

export default initialFilters;
