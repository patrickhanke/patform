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
		filters: filters,
		moduleId: moduleId,
		skip: skip,
		limit: limit
	});

	return {
		loading,
		content: data || [],
		refetch,
		count: count || 0
	};
};

export default useFindContent;
