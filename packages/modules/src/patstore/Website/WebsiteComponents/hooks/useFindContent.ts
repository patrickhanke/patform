import { useFindData } from "@repo/provider";
import { UseFindContentHook } from "../types";

const useFindContent: UseFindContentHook = ({
	moduleId,
	filters,
	limit,
	skip
}) => {
	const { loading, data, refetch, count } = useFindData({
		objectName: "Content",
		fields: [
			"objectId",
			"title",
			"content_id",
			"type",
			"createdAt",
			"active",
			"content",
			"created_by {objectId username}",
			"updated_by {objectId username}",
			"categories"
		],
		moduleId: moduleId,
		filters: filters,
		skip: skip,
		limit: limit
	});

	return {
		loading,
		content: data ? data : [],
		refetch,
		count: count
	};
};

export default useFindContent;
