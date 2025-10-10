import { useQuery } from "@apollo/client";
import {
	generateGraphQLQuery,
	generateQueryFromFields,
	paramsHandler
} from "@repo/provider";
import { UseFindEventHook } from "../types";

const useFindEvent: UseFindEventHook = ({ module, filters, limit, skip }) => {
	const { loading, data, refetch } = useQuery(
		generateGraphQLQuery({
			type: "find",
			objectName: "Event",
			fields: generateQueryFromFields(module.fields)
		}),
		{
			variables: {
				params: paramsHandler({ moduleId: module.objectId, filters }),
				limit,
				skip
			},
			notifyOnNetworkStatusChange: true
		}
	);

	return {
		loading,
		events: data ? data.objects.findEvent.results : undefined,
		refetch
	};
};

export default useFindEvent;
