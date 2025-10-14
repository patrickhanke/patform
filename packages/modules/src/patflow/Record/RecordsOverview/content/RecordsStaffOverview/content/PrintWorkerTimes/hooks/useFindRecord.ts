import { generateGraphQLQuery } from "@repo/provider";
import { useQuery } from "@apollo/client";
import { UseFindRecord } from "../types";

const useFindRecord: UseFindRecord = ({ year, users = [] }) => {
	const { loading, data, refetch } = useQuery(
		generateGraphQLQuery({
			objectName: "Record",
			type: "find",
			fields: ["objectId", "year", "user {objectId}", "default_times"]
		}),
		{
			variables: {
				params: { year: { _eq: year }, user: { _in: users } }
			},
			notifyOnNetworkStatusChange: true,
			skip: !year || users.length === 0
		}
	);

	console.log({ data });

	return {
		loading,
		records: data ? data.objects.findRecord.results : [],
		refetch
	};
};

export default useFindRecord;
