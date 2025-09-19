import { generateGraphQLQuery } from "@repo/provider";
import { useQuery } from "@apollo/client";

const useGetHolidays = ({ projectId }) => {
	const { data: holidayData, refetch: refetchHolidays } = useQuery(
		generateGraphQLQuery({
			type: "find",
			objectName: "Holiday",
			fields: ["objectId", "name", "label", "type", "dates"]
		}),
		{
			variables: {
				params: {
					type: { _eq: "holiday" },
					project: { _eq: projectId }
				}
			},
			skip: !projectId
		}
	);

	return { holidays: holidayData?.objects.findHoliday.results || [] };
};

export default useGetHolidays;
