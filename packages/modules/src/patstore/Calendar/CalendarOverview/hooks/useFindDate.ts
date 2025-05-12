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
				"date",
				"title",
				"image",
				"description",
				"fields",
				"data",
				"categories"
			]
		}),
		{
			variables: {
				params: paramsHandler({ moduleId, filters }),
				skip,
				limit,
				order: "date_DESC"
			},
			notifyOnNetworkStatusChange: true
		}
	);

	return {
		loading,
		dates: data ? data.objects.findDate.results : undefined,
		refetch,
		count: data ? data.objects.findDate.count : 0
	};
};

export default useFindDate;
