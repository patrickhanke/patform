import { useQuery } from "@apollo/client";
import { generateGraphQLQuery, paramsHandler } from "@repo/provider";
import { UseFindUser } from "../types";

const useFindUser: UseFindUser = ({ filters, limit, skip }) => {
	const { loading, data, refetch } = useQuery(
		generateGraphQLQuery({
			type: "find",
			objectName: "_User",
			fields: ["objectId", "username", "email", "name", "roles"]
		}),
		{
			variables: {
				params: paramsHandler({ filters }),
				skip,
				limit
			},
			notifyOnNetworkStatusChange: true
		}
	);

	return {
		loading,
		users: data ? data.objects.find_User.results : undefined,
		refetch,
		count: data ? data.objects.find_User.count : 0
	};
};

export default useFindUser;
