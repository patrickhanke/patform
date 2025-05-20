import { UseFindImagesHook } from "../types";
import { gql, useQuery } from "@apollo/client";
import { paramsHandler } from "@repo/provider";
import { useMemo } from "react";

const query = gql`
	query findPatstoreImages(
		$params: ImageConstraints
		$limit: Int
		$skip: Int
		$order: [ImageOrder!]
	) {
		objects {
			findImage(
				where: $params
				limit: $limit
				skip: $skip
				order: $order
			) {
				results {
					objectId
					filePath
					name
				}
				count
			}
		}
	}
`;

const useFindPatformImages: UseFindImagesHook = ({
	moduleId,
	filters,
	limit,
	skip
}) => {
	const { loading, data, refetch } = useQuery(query, {
		variables: {
			order: "createdAt_DESC",
			params: paramsHandler({ moduleId, filters }),
			limit,
			skip
		},
		fetchPolicy: "cache-and-network"
	});

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

export default useFindPatformImages;
