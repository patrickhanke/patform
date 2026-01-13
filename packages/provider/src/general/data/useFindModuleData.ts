import {
	generateQueryFromFields,
	paramsHandler,
	useFindData
} from "@repo/provider";
import { useMemo } from "react";
import { ApolloRefetch, Classes, Filter, Module } from "@repo/types";

function useFindModuleData<T extends Classes>({
	module,
	filters,
	limit,
	skip,
	order,
	additionalFields = []
}: {
	module: Module;
	filters: Filter[];
	limit: number;
	skip: number;
	order?: string;
	additionalFields?: string[];
}): {
	loading: boolean;
	data?: T[];
	refetch: ApolloRefetch;
	count: number;
} {
	console.log(paramsHandler({ moduleId: module.objectId, filters }));
	const { loading, data, refetch, count } = useFindData({
		objectName:
			module.connected_class === "Person"
				? "People"
				: module.connected_class,
		fields: [
			...generateQueryFromFields(module.fields),
			...additionalFields,
			"data"
		],
		moduleId: module.objectId,
		filters,
		limit,
		skip,
		order
	});

	const returnValue = useMemo(
		() => ({
			loading,
			data,
			refetch,
			count
		}),
		[data, loading]
	);

	return returnValue;
}

export default useFindModuleData;
