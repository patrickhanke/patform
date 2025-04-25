import { useQuery } from "@apollo/client";
import { generateGraphQLQuery, paramsHandler } from "@repo/provider";
import { UseFindFormDataHook } from "../types";

const useFindFormData: UseFindFormDataHook = ({ filters, limit, skip }) => {
	const { loading, data, refetch } = useQuery(
		generateGraphQLQuery({
			type: "find",
			objectName: "Data",
			fields: ["objectId", "createdAt", "data"]
		}),
		{
			variables: {
				params: paramsHandler({ filters }),
				skip,
				limit
			},
			notifyOnNetworkStatusChange: true,
			fetchPolicy: "cache-first"
		}
	);

	return {
		loading,
		data: data ? data.objects.findData.results : [],
		refetch,
		count: data ? data.objects.findData.count : 0
	};
};

export default useFindFormData;
