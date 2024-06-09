import { Filter, FilterOperator } from '@repo/types';

type FilterObject = { [key: string]: { [ key in FilterOperator ]: any }}

const paramsHandler = (projectId: string, filters: Filter[]) => {

	let filterObject: FilterObject = {};
	if (projectId) {
		filterObject.project = {_eq: projectId} as { [ key in FilterOperator ]: any };
	}

	if (filters && filters?.length > 0) {
		filterObject = filters?.reduce((acc: { [key: string]: { [ key in FilterOperator ]: any }}, filter: Filter) => {
			acc[filter.key] = {[filter.operator]: filter.value} as { [ key in FilterOperator ]: any };
			return acc;
		}, {});
	}
	return {...filterObject};
	return {...filterObject};
};

export default paramsHandler;