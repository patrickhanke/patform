import { useFindData } from "@repo/provider";
import { UseFindRecord } from "../types";

const useFindRecord: UseFindRecord = ({ year, users = [] }) => {
	const { loading, data, refetch } = useFindData({
		objectName: "Record",
		fields: ["objectId", "year", "user {objectId}", "default_times"],
		filters: [{ key: "year", value: year, operator: "equalTo" }],
		userIds: users,
		skipQuery: !year || users.length === 0
	});

	return {
		loading,
		records: data || [],
		refetch
	};
};

export default useFindRecord;
