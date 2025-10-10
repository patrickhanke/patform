import { useQuery } from "@apollo/client";
import {
	generateGraphQLQuery,
	generateQueryFromFields,
	paramsHandler
} from "@repo/provider";
import { useMemo } from "react";
import { ApolloRefetch, Classes, Filter, Module } from "@repo/types";
import { get } from "lodash-es";

function useFindModuleData<T extends Classes>({
	module,
	filters,
	limit,
	skip,
	order
}: {
	module: Module;
	filters: Filter[];
	limit: number;
	skip: number;
	order?: string;
}): {
	loading: boolean;
	data?: T[];
	refetch: ApolloRefetch;
	count: number;
} {
	const { loading, data, refetch } = useQuery(
		generateGraphQLQuery({
			type: "find",
			objectName: module.connected_class,
			fields: generateQueryFromFields(module.fields)
		}),
		{
			variables: {
				params: paramsHandler({ moduleId: module.objectId, filters }),
				limit,
				skip,
				order: order || "createdAt_DESC"
			},
			notifyOnNetworkStatusChange: true
		}
	);
	const returnValue = useMemo(
		() => ({
			loading,
			data: get(
				data,
				`objects.find${module.connected_class}.results`,
				[]
			),
			refetch,
			count: get(data, `objects.find${module.connected_class}.count`, 0)
		}),
		[data, loading]
	);

	return returnValue;
}

export default useFindModuleData;
