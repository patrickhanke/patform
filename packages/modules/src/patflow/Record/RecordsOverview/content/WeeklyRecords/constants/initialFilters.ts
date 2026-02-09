import { Filter } from "@repo/types";

const initialFilters: Filter[] = [
	{
		key: "year",
		operator: "equalTo",
		value: new Date().getFullYear()
	}
];

export default initialFilters;
