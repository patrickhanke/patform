import { UseFindImagesHook } from "../types";
import { useQuery } from "@apollo/client";
import {
	generateGraphQLQuery,
	generateQueryFromFields,
	paramsHandler
} from "@repo/provider";
import { useMemo } from "react";

const useFindImages: UseFindImagesHook = ({ module, filters, limit, skip }) => {
	const { loading, data, refetch } = useQuery(
		generateGraphQLQuery({
			type: "find",
			objectName: "Image",
			fields: generateQueryFromFields(module.fields)
		}),
		{
			variables: {
				order: "createdAt_DESC",
				params: paramsHandler({ moduleId: module.objectId, filters }),
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
