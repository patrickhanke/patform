import { useFindData } from "@repo/provider";
import { UseFindSurcharges } from "../types";

const useFindSurcharges: UseFindSurcharges = () => {
	const { data, loading, refetch } = useFindData({
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
	});

	return {
		loading,
		surcharges: data || [],
		refetch
	};
};

export default useFindSurcharges;
