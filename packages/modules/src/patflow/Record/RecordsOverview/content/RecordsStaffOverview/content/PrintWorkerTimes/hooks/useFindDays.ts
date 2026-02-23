import { useFindData } from "@repo/provider";
import { UseFindDays } from "../types";

const useFindDays: UseFindDays = ({ year, users = [] }) => {
	const { loading, data, refetch } = useFindData({
		objectName: "Day",
		fields: [
			"objectId",
			"date",
			"time",
			"user {objectId}",
			"year",
			"type",
			"surcharges"
		],
		filters: [{ key: "year", value: year, operator: "equalTo" }],
		userIds: users,
		skipQuery: !year || users.length === 0
	});

	return {
		loading,
		days: data || [],
		refetch
	};
};

export default useFindDays;
