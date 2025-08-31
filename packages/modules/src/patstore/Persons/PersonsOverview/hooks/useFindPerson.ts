import { useQuery } from "@apollo/client";
import { generateGraphQLQuery, paramsHandler } from "@repo/provider";
import { UseFindPersonsHook } from "../types";

const useFindPerson: UseFindPersonsHook = ({
	moduleId,
	filters,
	limit,
	skip
}) => {
	const { loading, data, refetch } = useQuery(
		generateGraphQLQuery({
			type: "find",
			objectName: "Person",
			fields: [
				"objectId",
				"name",
				"portrait",
				"email",
				"data",
				"categories"
			]
		}),
		{
			variables: {
				order: "name_ASC",
				params: paramsHandler({ moduleId, filters }),
				limit,
				skip
			},
			notifyOnNetworkStatusChange: true
		}
	);

	return {
		loading,
		persons: data ? data.objects.findPerson.results : undefined,
		refetch,
		count: data ? data.objects.findPerson.count : 0
	};
};

export default useFindPerson;
