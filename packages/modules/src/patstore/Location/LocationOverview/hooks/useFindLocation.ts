import { useQuery } from "@apollo/client";
import { generateGraphQLQuery, paramsHandler } from "@repo/provider";
import { UseFindLocationHook } from "../types";

const useFindLocation: UseFindLocationHook = ({
	moduleId,
	filters,
	limit,
	skip
}) => {
	const { loading, data, refetch } = useQuery(
		generateGraphQLQuery({
			type: "find",
			objectName: "Location",
			fields: [
				"objectId",
				"name",
				"image",
				"createdAt",
				"description",
				"address",
				"coordinates{latitude longitude}",
				"categories"
			]
		}),
		{
			variables: {
				params: paramsHandler({ moduleId, filters }),
				skip,
				limit
			},
			notifyOnNetworkStatusChange: true
		}
	);

	return {
		loading,
		locations: data ? data.objects.findLocation.results : undefined,
		refetch,
		count: data ? data.objects.findLocation.count : 0
	};
};

export default useFindLocation;
