import { useQuery } from "@apollo/client";
import {
	generateGraphQLQuery,
	generateQueryFromFields,
	paramsHandler
} from "@repo/provider";
import { UseFindPersonsHook } from "../types";

const useFindPerson: UseFindPersonsHook = ({
	module,
	filters,
	limit,
	skip
}) => {
	const { loading, data, refetch } = useQuery(
		generateGraphQLQuery({
			type: "find",
			objectName: "Person",
			fields: generateQueryFromFields(module.fields)
		}),
		{
			variables: {
				order: "name_ASC",
				params: paramsHandler({ moduleId: module.objectId, filters }),
				limit,
				skip
			},
			notifyOnNetworkStatusChange: true
		}
	);

	return {
		loading,
		persons: data ? data.objects.findPerson.results : undefined,
		refetch,
		count: data ? data.objects.findPerson.count : 0
	};
};

export default useFindPerson;
