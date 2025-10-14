import { generateGraphQLQuery } from "@repo/provider";
import { useQuery } from "@apollo/client";
import { UseFindSurcharges } from "../types";

const useFindSurcharges: UseFindSurcharges = () => {
	const { data, loading, refetch } = useQuery(
		generateGraphQLQuery({
			type: "find",
			objectName: "Surcharge",
			fields: [
				"objectId",
				"name",
				"createdAt",
				"active",
				"type",
				"time_value",
				"day_value",
				"work_value",
				"value",
				"start_date",
				"end_date"
			]
		})
	);

	return {
		loading,
		surcharges: data ? data.objects.findSurcharge.results : [],
		refetch
	};
};

export default useFindSurcharges;
