import { useQuery } from "@apollo/client";
import { generateGraphQLQuery, paramsHandler } from "@repo/provider";
import { UseFindContentHook } from "../types";

const useFindContent: UseFindContentHook = ({
	moduleId,
	filters,
	limit,
	skip
}) => {
	const { loading, data, refetch } = useQuery(
		generateGraphQLQuery({
			type: "find",
			objectName: "Content",
			fields: [
				"objectId",
				"title",
				"content_id",
				"type",
				"createdAt",
				"active",
				"content",
				"created_by {objectId username}",
				"updated_by {objectId username}",
				"categories"
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
		content: data ? data.objects.findContent.results : [],
		refetch,
		count: data ? data.objects.findContent.count : 0
	};
};

export default useFindContent;
