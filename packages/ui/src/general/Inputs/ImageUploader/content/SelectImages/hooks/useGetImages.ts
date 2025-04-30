import { UseGetImagesHook } from "../types";
import { useQuery } from "@apollo/client";
import { find_images } from "../constants/find_images";
import { generateGraphQLQuery, paramsHandler } from "@repo/provider";
import { useMemo } from "react";

const useGetImages: UseGetImagesHook = ({ moduleId, filters }) => {
	const { loading, data, refetch } = useQuery(
		generateGraphQLQuery({
			type: "find",
			objectName: "Image",
			fields: ["objectId", "createdAt", "name", "filePath"]
		}),
		{
			variables: { params: paramsHandler({ moduleId, filters }) },
			notifyOnNetworkStatusChange: true
		}
	);

	const returnObject = useMemo(
		() => ({
			loading,
			images: data ? data.objects.findImage.results : undefined,
			refetch
		}),
		[data, loading, refetch]
	);

	return returnObject;
};

export default useGetImages;
