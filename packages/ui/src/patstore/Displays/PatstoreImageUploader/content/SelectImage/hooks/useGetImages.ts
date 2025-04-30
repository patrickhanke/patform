import { UseFindImagesHook } from "../types";
import { useQuery } from "@apollo/client";
import { generateGraphQLQuery, paramsHandler } from "@repo/provider";
import { useMemo } from "react";

const useFindImages: UseFindImagesHook = ({
	moduleId,
	filters,
	limit,
	skip
}) => {
	const { loading, data, refetch } = useQuery(
		generateGraphQLQuery({
			type: "find",
			objectName: "Image",
			fields: ["objectId", "filePath", "name"]
		}),
		{
			variables: {
				order: "createdAt_DESC",
				params: paramsHandler({ moduleId, filters }),
				limit,
				skip
			},
			notifyOnNetworkStatusChange: true
		}
	);

	const returnObject = useMemo(
		() => ({
			loading,
			images: data ? data.objects.findImage.results : [],
			refetch,
			count: data ? data.objects.findImage.count : 0
		}),
		[data, loading, refetch]
	);

	return returnObject;
};

export default useFindImages;
