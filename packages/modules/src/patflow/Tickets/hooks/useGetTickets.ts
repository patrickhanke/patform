import { useFindData } from "@repo/provider";
import { ApolloRefetch, Ticket } from "@repo/types";
import { UseGetTicketsHook } from "../types";

type GetTaskObject = {
	loading: boolean;
	tickets?: Ticket[];
	refetch: ApolloRefetch;
	count: number;
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
