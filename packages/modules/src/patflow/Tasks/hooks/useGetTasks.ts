import { generateGraphQLQuery } from "@repo/provider";
import { ApolloRefetch, Filter, Task } from "@repo/types";
import { useQuery } from "@apollo/client";
import { UseGetTasksHook } from "../types";

type GetTaskObject = {
	loading: boolean;
	tasks?: Task[];
	refetch: ApolloRefetch;
	count: number;
};

const paramsHandler = (id?: string, className?: string, filters?: Filter[]) => {
	if (id && className === "Property") return { property: { _eq: id } };
	if (filters && filters?.length > 0) {
		const filterObject = filters?.reduce(
			(acc: { [key: string]: { [op: string]: any } }, filter: Filter) => {
				acc[filter.key] = { [filter.operator]: filter.value };
				return acc;
			},
			{}
		);
		return filterObject;
	}
	return undefined;
};

const useGetTasks = ({
	id,
	className,
	filters,
	limit,
	skip
}: UseGetTasksHook) => {
	const { loading, data, refetch } = useQuery(
		generateGraphQLQuery({
			type: "find",
			objectName: "Task",
			fields: [
				"objectId",
				"title",
				"state",
				"time",
				"assigned_staff",
				"dates",
				"executed_at"
			]
		}),
		{
			variables: {
				params: paramsHandler(id, className, filters),
				limit,
				skip
			},
			notifyOnNetworkStatusChange: true,
			fetchPolicy: "network-only"
		}
	);

	return {
		loading,
		tasks: data ? data.objects.findTask.results : undefined,
		refetch,
		count: data ? data.objects.findTask.count : 0
	} as GetTaskObject;
};

export default useGetTasks;
