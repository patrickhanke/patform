import { Filter } from "@repo/types";
import { ParamsHandlerType } from "../types";

type FilterObject = {
	[key: string]: { [key: string]: string | number | boolean | object | null };
};

const paramsHandler: ParamsHandlerType = ({
	projectId,
	moduleId,
	filters,
	userId,
	propertyId,
	userIds,
	absenceId
}) => {
	const filterObject: FilterObject = {};

	if (propertyId) {
		filterObject.property = {
			have: { objectId: { equalTo: propertyId } }
		};
	}

	if (projectId) {
		filterObject.project = { have: { id: { equalTo: projectId } } };
	}

	if (moduleId) {
		filterObject.module = { have: { id: { equalTo: moduleId } } };
	}

	if (userId) {
		filterObject.user = { have: { objectId: { equalTo: userId } } };
	}

	if (userIds) {
		filterObject.user = { have: { objectId: { in: userIds } } };
	}

	if (absenceId) {
		filterObject.absence = { have: { objectId: { equalTo: absenceId } } };
	}

	let additionalFilters: FilterObject = {};

	if (filters && filters?.length > 0) {
		additionalFilters = filters?.reduce(
			(
				acc: Record<
					string,
					{ [key: string]: string | number | boolean | object | null }
				>,
				filter: Filter
			) => {
				if (!filter.value) {
					return acc;
				}
				// Support operatorTemplate for complex nested structures (e.g. Pointer: location.have.objectId.equalTo)
				if (filter.operator === "matchesRegex") {
					acc[filter.key] = {
						[filter.operator]: filter.value,
						options: "i"
					};
				} else {
					acc[filter.key] = {
						[filter.operator]: filter.value as
							| string
							| number
							| boolean
							| object
							| null
					};
					acc[filter.key] = {
						[filter.operator]: filter.value as
							| string
							| number
							| boolean
							| object
							| null
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
