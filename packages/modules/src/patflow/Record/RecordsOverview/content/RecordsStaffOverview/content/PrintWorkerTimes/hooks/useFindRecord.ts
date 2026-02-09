import { useFindData } from "@repo/provider";
import { UseFindRecord } from "../types";

const useFindRecord: UseFindRecord = ({ year, users = [] }) => {
	const { loading, data, refetch } = useFindData({
		objectName: "Record",
		fields: ["objectId", "year", "user {objectId}", "default_times"],
		filters: [
			{ key: "year", value: year, operator: "equalTo" },
			{ key: "user", value: users, operator: "in" }
		],
		skipQuery: !year || users.length === 0
	});

	console.log({ data });

	return {
		loading,
		records: data || [],
		refetch
	};
};

export default useFindRecord;
