import { UseFindImagesHook } from "../types";
import { useFindData } from "@repo/provider";
import { useMemo } from "react";
import { ImageClass } from "@repo/types";

const useFindImages: UseFindImagesHook = ({
	moduleId,
	filters,
	limit,
	skip
}) => {
	const { loading, data, refetch } = useFindData({
		objectName: "Image",
		fields: ["objectId", "filePath", "title"],
		moduleId,
		filters,
		limit,
		skip
	});

	const returnObject = useMemo(
		() => ({
			loading,
			images: (data || []) as ImageClass[],
			refetch,
			count: data ? data.length : 0
		}),
		[data, loading, refetch]
	);

	return returnObject;
};

export default useFindImages;
