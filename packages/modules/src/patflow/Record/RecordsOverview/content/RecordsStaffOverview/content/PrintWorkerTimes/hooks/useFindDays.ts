import { useFindData } from "@repo/provider";
import { UseFindDays } from "../types";

const useFindDays: UseFindDays = ({ year, users = [] }) => {
	const { loading, data, refetch } = useFindData({
		objectName: "Day",
		fields: ["objectId", "date", "time", "user {objectId}", "year"],
		filters: [
			{ key: "year", value: year, operator: "equalTo" },
			{ key: "user", value: users, operator: "in" }
		],
		skipQuery: !year || users.length === 0
	});

	console.log({ data });

	return {
		loading,
		days: data || [],
		refetch
	};
};

export default useFindDays;
