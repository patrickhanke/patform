import { useFindData } from "@repo/provider";
import { ApolloRefetch, Filter, FilterOperator, Ticket } from "@repo/types";
import { UseGetTicketsHook } from "../types";

type GetTaskObject = {
	loading: boolean;
	tickets?: Ticket[];
	refetch: ApolloRefetch;
	count: number;
};

const paramsHandler = (
	id: string,
	className: string,
	filters: Filter[],
	archived: boolean
) => {
	let filterObject = {};
	let objectObject = {};

	const archivedObject = { archived: { _eq: archived } };
	if (id && className === "Property") {
		objectObject = { property: { _eq: id } };
	}

	if (filters && filters?.length > 0) {
		filterObject = filters?.reduce(
			(
				acc: { [key: string]: { [key in FilterOperator]: any } },
				filter: Filter
			) => {
				acc[filter.key] = { [filter.operator]: filter.value } as {
					[key in FilterOperator]: any;
				};
				return acc;
			},
			{}
		);
	}
	return [{ ...filterObject, ...archivedObject, ...objectObject }];
};

const useGetTickets = ({ filters, limit, skip }: UseGetTicketsHook) => {
	const { loading, data, refetch, count } = useFindData({
		objectName: "Ticket",
		fields: [
			"objectId",
			"id: objectId",
			"createdAt",
			"state",
			"title",
			"description",
			"images",
			"property { objectId id: objectId name }",
			"created_by { objectId id: objectId }",
			"task { objectId id: objectId title }"
		],
		filters: filters,
		limit,
		skip
	});

	return {
		loading,
		tickets: data,
		refetch,
		count
	} as GetTaskObject;
};

export default useGetTickets;
