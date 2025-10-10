import { useQuery } from "@apollo/client";
import {
	generateGraphQLQuery,
	generateQueryFromFields,
	paramsHandler
} from "@repo/provider";
import { UseFindArticlesHook } from "../types";

const useFindArticles: UseFindArticlesHook = ({
	module,
	filters,
	limit,
	skip
}) => {
	const { loading, data, refetch } = useQuery(
		generateGraphQLQuery({
			type: "find",
			objectName: "Article",
			fields: generateQueryFromFields(module.fields)
		}),
		{
			variables: {
				order: "date_DESC",
				params: paramsHandler({ moduleId: module.objectId, filters }),
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
