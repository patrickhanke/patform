import { useFindData } from "@repo/provider";
import { UseFindDays } from "../types";

const useFindDays: UseFindDays = ({ year, users = [] }) => {
	const { loading, data, refetch } = useFindData({
		objectName: "Day",
		fields: ["objectId", "date", "times", "user {objectId}", "year"],
		filters: [
			{ key: "year", value: year, operator: "_eq" },
			{ key: "user", value: users, operator: "_in" }
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
