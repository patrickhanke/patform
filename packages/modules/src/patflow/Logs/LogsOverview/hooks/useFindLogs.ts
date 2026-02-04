import { useFindData } from "@repo/provider";
import { UseFindLogsHook } from "../types";

const useFindLogs: UseFindLogsHook = ({ moduleId, filters, limit, skip }) => {
	const { loading, data, refetch, count } = useFindData({
		objectName: "Log",
		fields: ["objectId", "class", "reference_id", "type", "data"],
		moduleId,
		filters,
		limit,
		skip,
		order: "name_ASC"
	});

	return {
		loading,
		logs: data,
		refetch,
		count
	};
};

export default useFindLogs;
