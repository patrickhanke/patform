import { useQuery } from "@apollo/client";
import { generateGraphQLQuery, paramsHandler } from "@repo/provider";
import { UseFindGroupHook } from "../types";

const useFindGroup: UseFindGroupHook = ({ moduleId, filters, limit, skip }) => {
	const { loading, data, refetch } = useQuery(
		generateGraphQLQuery({
			type: "find",
			objectName: "Group",
			fields: [
				"objectId",
				"label",
				"times",
				"title",
				"image",
				"state",
				"fields",
				"data",
				"persons",
				"team",
				"categories"
			]
		}),
		{
			variables: {
				params: paramsHandler({ moduleId, filters }),
				skip,
				limit
			},
			notifyOnNetworkStatusChange: true,
			fetchPolicy: "cache-first"
		}
	);

	return {
		loading,
		groups: data ? data.objects.findGroup.results : undefined,
		refetch,
		count: data ? data.objects.findGroup.count : 0
	};
};

export default useFindGroup;
