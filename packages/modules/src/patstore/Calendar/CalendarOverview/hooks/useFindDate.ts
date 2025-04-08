import { useQuery } from "@apollo/client";
import { generateGraphQLQuery, paramsHandler } from "@repo/provider";
import { UseFindDateHook } from "../types";

const useFindDate: UseFindDateHook = ({ moduleId, filters, limit, skip }) => {
	const { loading, data, refetch } = useQuery(
		generateGraphQLQuery({
			type: "find",
			objectName: "Date",
			fields: [
				"objectId",
				"label",
				"dates",
				"title",
				"image",
				"description",
				"fields",
				"data"
			]
		}),
		{
			variables: {
				params: paramsHandler({ moduleId, filters }),
				skip,
				limit
			},
			notifyOnNetworkStatusChange: true
		}
	);

	return {
		loading,
		groups: data ? data.objects.findGroup.results : undefined,
		refetch,
		count: data ? data.objects.findGroup.count : 0
	};
};

export default useFindDate;
