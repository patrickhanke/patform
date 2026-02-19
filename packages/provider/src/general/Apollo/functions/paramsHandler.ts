import { Filter, FilterOperator } from "@repo/types";
import { ParamsHandlerType } from "../types";

type FilterObject = { [key: string]: { [key in FilterOperator]: any } };

const paramsHandler: ParamsHandlerType = ({
	projectId,
	moduleId,
	filters,
	userId,
	propertyId
}) => {
	const filterObject: FilterObject = {};

	if (propertyId) {
		filterObject.property = { have: { objectId: { equalTo: propertyId } } } as {
			[key in FilterOperator]: any;
		};
	}

	if (projectId) {
		filterObject.project = { have: { id: { equalTo: projectId } } } as {
			[key in FilterOperator]: any;
		};
	}

	if (moduleId) {
		filterObject.module = { have: { id: { equalTo: moduleId } } } as {
			[key in FilterOperator]: any;
		};
	}

	if (userId) {
		filterObject.user = { have: { objectId: { equalTo: userId } } } as {
			[key in FilterOperator]: any;
		};
	}

	let additionalFilters: FilterObject = {};

	console.log("filters", filters);

	if (filters && filters?.length > 0) {
		additionalFilters = filters?.reduce(
			(
				acc: Record<string, { [key in FilterOperator]: any }>,
				filter: Filter
			) => {
				if (filter.operator === "matchesRegex") {
					acc[filter.key] = {
						[filter.operator]: filter.value,
						_options: "i"
					} as {
						matchesRegex: string;
						_options: string;
					};
				} else {
					acc[filter.key] = { [filter.operator]: filter.value } as {
						[key in FilterOperator]: any;
					};
				}
				return acc;
			},
			{}
		);
	}
	console.log("additionalFilters", additionalFilters);
	return { ...filterObject, ...additionalFilters };
};

export default paramsHandler;
