import { generateQueryFromFields, useFindData } from "@repo/provider";
import { useMemo } from "react";
import { Module, Filter, DownloadClass, ApolloRefetch } from "@repo/types";

export type UseFindDownloadHook = (T: {
	module: Module;
	filters: Filter[];
	limit: number;
	skip: number;
}) => {
	loading: boolean;
	downloads?: DownloadClass[];
	refetch: ApolloRefetch;
	count: number;
};

const useFindDownload: UseFindDownloadHook = ({
	module,
	filters,
	limit,
	skip
}) => {
	const { loading, data, refetch } = useFindData({
		objectName: "Download",
		fields: generateQueryFromFields(module.fields),
		moduleId: module.objectId,
		filters,
		limit,
		skip
	});

	const returnValue = useMemo(
		() => ({
			loading,
			downloads: data ? data : undefined,
			refetch,
			count: data ? data.length : 0
		}),
		[data, loading]
	);

	return returnValue;
};

export default useFindDownload;
