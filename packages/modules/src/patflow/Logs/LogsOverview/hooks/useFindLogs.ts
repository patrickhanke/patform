import { useQuery } from "@apollo/client";
import { generateGraphQLQuery, paramsHandler } from "@repo/provider";
import { UseFindLogsHook } from "../types";

const useFindLogs: UseFindLogsHook = ({ moduleId, filters, limit, skip }) => {
	const { loading, data, refetch } = useQuery(
		generateGraphQLQuery({
			type: "find",
			objectName: "Log",
			fields: ["objectId", "class", "reference_id", "type", "data"]
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
		logs: data ? data.objects.findLog.results : undefined,
		refetch,
		count: data ? data.objects.findLog.count : 0
	};
};

export default useFindLogs;
