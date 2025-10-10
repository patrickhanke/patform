import { useQuery } from "@apollo/client";
import {
	generateGraphQLQuery,
	generateQueryFromFields,
	paramsHandler
} from "@repo/provider";
import { UseFindNewsHook } from "../types";

const useFindNews: UseFindNewsHook = ({ module, filters, limit, skip }) => {
	const { loading, data, refetch } = useQuery(
		generateGraphQLQuery({
			type: "find",
			objectName: "News",
			fields: generateQueryFromFields(module.fields)
		}),
		{
			variables: {
				order: "date_DESC",
				params: paramsHandler({ moduleId: module.objectId, filters }),
				skip,
				limit
			},
			notifyOnNetworkStatusChange: true
		}
	);

	return {
		loading,
		news: data?.objects.findNews.results || [],
		refetch,
		count: data?.objects.findNews.count || 0
	};
};

export default useFindNews;
