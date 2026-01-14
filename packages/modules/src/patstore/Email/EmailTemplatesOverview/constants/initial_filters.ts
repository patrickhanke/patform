import { Filter } from "@repo/types";

const initial_filters: Filter[] = [
	{
		key: "type",
		operator: "equalTo",
		value: "email",
		id: "type"
	}
];

export default initial_filters;
