import { generateQueryFromFields, useFindData } from "@repo/provider";
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
	module?: Module;
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
	const { loading, data, refetch, count } = useFindData({
		objectName: (module?.connected_class || "_User") as string,
		fields: [
			...generateQueryFromFields(module?.fields ?? []),
			...additionalFields,
			"data"
		],
		moduleId: module?.objectId,
		filters,
		limit,
		skip,
		order,
		skipQuery: !module?.connected_class
	});

	const returnValue = useMemo(
		() => ({
			loading: !module || loading,
			data,
			refetch,
			count
		}),
		[data, loading, module]
	);

	return returnValue;
}

export default useFindModuleData;
