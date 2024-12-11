import { Filter, FilterOperator } from '@repo/types';
import { ParamsHandlerType } from '../types';

type FilterObject = { [key: string]: { [ key in FilterOperator ]: any }}

const paramsHandler : ParamsHandlerType = ({projectId, filters}) => {
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
};

export default paramsHandler;