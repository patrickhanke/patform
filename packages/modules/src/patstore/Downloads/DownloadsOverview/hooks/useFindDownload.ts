import { useQuery } from "@apollo/client";
import {
	generateGraphQLQuery,
	generateQueryFromFields,
	paramsHandler
} from "@repo/provider";
import { UseFindDownloadHook } from "../types";
import { useMemo } from "react";

const useFindDownload: UseFindDownloadHook = ({
	module,
	filters,
	limit,
	skip
}) => {
	const { loading, data, refetch } = useQuery(
		generateGraphQLQuery({
			type: "find",
			objectName: "Download",
			fields: generateQueryFromFields(module.fields)
		}),
		{
			variables: {
				params: paramsHandler({ moduleId: module.objectId, filters }),
				limit,
				skip,
				order: "createdAt_DESC"
			},
			notifyOnNetworkStatusChange: true
		}
	);

	const returnValue = useMemo(
		() => ({
			loading,
			downloads: data ? data.objects.findDownload.results : undefined,
			refetch,
			count: data ? data.objects.findDownload.count : 0
		}),
		[data, loading]
	);

	return returnValue;
};

export default useFindDownload;
