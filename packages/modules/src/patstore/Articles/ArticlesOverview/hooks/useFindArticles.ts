import { useQuery } from "@apollo/client";
import { generateGraphQLQuery, paramsHandler } from "@repo/provider";
import { UseFindArticlesHook } from "../types";

const useFindArticles: UseFindArticlesHook = ({
	moduleId,
	filters,
	limit,
	skip
}) => {
	const { loading, data, refetch } = useQuery(
		generateGraphQLQuery({
			type: "find",
			objectName: "Article",
			fields: [
				"objectId",
				"title",
				"image",
				"createdAt",
				"data",
				"state",
				"text",
				"gallery",
				"date",
				"categories",
				"author {objectId label portrait}"
			]
		}),
		{
			variables: {
				order: "date_DESC",
				params: paramsHandler({ moduleId, filters }),
				limit,
				skip
			},
			notifyOnNetworkStatusChange: true
		}
	);

	return {
		loading,
		articles: data?.objects.findArticle.results || undefined,
		count: data?.objects.findArticle.count || 0,
		refetch
	};
};

export default useFindArticles;
