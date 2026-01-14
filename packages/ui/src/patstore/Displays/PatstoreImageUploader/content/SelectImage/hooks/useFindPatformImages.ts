import { UseFindImagesHook } from "../types";
import { useFindData } from "@repo/provider";
import { useMemo } from "react";

// const query = gql`
// 	query findPatstoreImages(
// 		$params: ImageConstraints
// 		$limit: Int
// 		$skip: Int
// 		$order: [ImageOrder!]
// 	) {
// 		objects {
// 			findImage(
// 				where: $params
// 				limit: $limit
// 				skip: $skip
// 				order: $order
// 			) {
// 				results {
// 					objectId
// 					name
// 					title
// 					file {
// 						name
// 						url
// 					}
// 				}
// 				count
// 			}
// 		}
// 	}
// `;

const useFindPatformImages: UseFindImagesHook = ({
	moduleId,
	filters,
	limit,
	skip
}) => {
	const { data, loading, refetch, count } = useFindData({
		objectName: "Image",
		fields: ["objectId", "name", "title", "file { name url }"],
		moduleId,
		filters,
		limit,
		skip
	});

	const returnObject = useMemo(
		() => ({
			loading,
			images: data ? data : [],
			refetch,
			count
		}),
		[data, loading, refetch]
	);
	return returnObject;
};

export default useFindPatformImages;
