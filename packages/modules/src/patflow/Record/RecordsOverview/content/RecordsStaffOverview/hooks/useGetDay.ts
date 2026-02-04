import { useFindData } from "@repo/provider";
import { UseGetDay } from "../types";

const useGetDay: UseGetDay = ({ year, user }) => {
	const { loading, data, refetch } = useFindData({
		objectName: "Day",
		fields: ["objectId", "date", "times", "user {objectId}", "year"],
		filters: [
			{ key: "year", value: year, operator: "_eq" },
			{ key: "user", value: user, operator: "_eq" }
		],
		skipQuery: !year || !user
	});

	return {
		loading,
		days: data || [],
		refetch
	};
};

export default useGetDay;
