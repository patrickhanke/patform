import { Filter, FilterOperator } from "@repo/types";
import { ParamsHandlerType } from "../types";

type FilterObject = { [key: string]: { [key in FilterOperator]: any } };

const paramsHandler: ParamsHandlerType = ({
	projectId,
	moduleId,
	filters,
	userId,
	propertyId,
	userIds
}) => {
	const filterObject: FilterObject = {};

	if (propertyId) {
		filterObject.property = {
			have: { objectId: { equalTo: propertyId } }
		} as {
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

	if (userIds) {
		filterObject.user = { have: { objectId: { in: userIds } } } as {
			[key in FilterOperator]: any;
		};
	}

	let additionalFilters: FilterObject = {};

	if (filters && filters?.length > 0) {
		additionalFilters = filters?.reduce(
			(
				acc: Record<string, { [key in FilterOperator]: any }>,
				filter: Filter
			) => {
				// Support operatorTemplate for complex nested structures (e.g. Pointer: location.have.objectId.equalTo)
				if (
					filter.operatorTemplate &&
					filter.value != null &&
					filter.value !== ""
				) {
					try {
						// Replace {{value}} - for strings use escaped content, for others use JSON
						const valueReplacement =
							typeof filter.value === "string"
								? JSON.stringify(filter.value).slice(1, -1)
								: JSON.stringify(filter.value);
						const templateStr = filter.operatorTemplate.replace(
							/\{\{value\}\}/g,
							valueReplacement
						);
						const parsed = JSON.parse(templateStr);
						Object.assign(acc, { [filter.key]: parsed });
					} catch {
						// Fallback to simple structure
						acc[filter.key] = {
							[filter.operator]: filter.value
						} as { [key in FilterOperator]: any };
					}
				} else if (filter.operator === "matchesRegex") {
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
	return { ...filterObject, ...additionalFilters };
};

export default paramsHandler;
