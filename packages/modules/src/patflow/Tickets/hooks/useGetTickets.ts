import { generateGraphQLQuery } from "@repo/provider";
import { ApolloRefetch, Filter, FilterOperator, Ticket } from "@repo/types";
import { useQuery } from "@apollo/client";
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
	return { ...filterObject, ...archivedObject, ...objectObject };
};

const useGetTickets = ({
	id = "",
	className = "",
	filters,
	archived = false,
	limit,
	skip
}: UseGetTicketsHook) => {
	const { loading, data, refetch } = useQuery(
		generateGraphQLQuery({
			type: "find",
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
			]
		}),
		{
			variables: {
				params: paramsHandler(id, className, filters, archived),
				limit,
				skip
			},
			notifyOnNetworkStatusChange: true
		}
	);

	return {
		loading,
		tickets: data ? data.objects.findTicket.results : undefined,
		refetch,
		count: data ? data.objects.findTicket.count : 0
	} as GetTaskObject;
};

export default useGetTickets;
