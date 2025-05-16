import { useQuery } from "@apollo/client";
import { generateGraphQLQuery, paramsHandler } from "@repo/provider";
import { UseFindNewsHook } from "../types";

const useFindNews: UseFindNewsHook = ({ moduleId, filters, limit, skip }) => {
	const { loading, data, refetch } = useQuery(
		generateGraphQLQuery({
			type: "find",
			objectName: "News",
			fields: [
				"objectId",
				"title",
				"image",
				"createdAt",
				"text",
				"data",
				"date",
				"categories"
			]
		}),
		{
			variables: {
				order: "date_DESC",
				params: paramsHandler({ moduleId, filters }),
				skip,
				limit
			},
			notifyOnNetworkStatusChange: true
		}
	);

	return {
		loading,
		news: data ? data.objects.findNews.results : undefined,
		refetch,
		count: data ? data.objects.findNews.count : 0
	};
};

export default useFindNews;
