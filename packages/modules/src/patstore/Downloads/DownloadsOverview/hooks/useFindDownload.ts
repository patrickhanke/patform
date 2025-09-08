import { useQuery } from "@apollo/client";
import { generateGraphQLQuery, paramsHandler } from "@repo/provider";
import { UseFindDownloadHook } from "../types";
import { useMemo } from "react";

const useFindDownload: UseFindDownloadHook = ({ moduleId, filters }) => {
	const { loading, data, refetch } = useQuery(
		generateGraphQLQuery({
			type: "find",
			objectName: "Download",
			fields: [
				"objectId",
				"label",
				"title",
				"image",
				"file{name url}",
				"categories"
			]
		}),
		{
			variables: { params: paramsHandler({ moduleId, filters }) },
			notifyOnNetworkStatusChange: true
		}
	);

	const returnValue = useMemo(
		() => ({
			loading,
			downloads: data ? data.objects.findDownload.results : undefined,
			refetch
		}),
		[data, loading]
	);

	return returnValue;
};

export default useFindDownload;
