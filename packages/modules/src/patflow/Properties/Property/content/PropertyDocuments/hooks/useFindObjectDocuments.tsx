import { useFindData } from "@repo/provider";
import { Filter } from "@repo/types";

const paramsHandler = (id?: string, type?: string): Filter[] => {
	if (id && type === "all")
		return [{ key: "object", value: id, operator: "equalTo" }];
	if (id && type === "task")
		return [
			{ key: "object", value: id, operator: "equalTo" },
			{ key: "type", value: "task", operator: "equalTo" }
		];
	if (id && type === "object")
		return [
			{ key: "object", value: id, operator: "equalTo" },
			{ key: "type", value: "object", operator: "equalTo" }
		];
	return [];
};

const useFindObjectsDocuments = ({
	id,
	type
}: {
	id: string;
	type: string;
}) => {
	const { data, loading, refetch } = useFindData({
		objectName: "Document",
		fields: [
			"createdAt",
			"objectId",
			"name",
			"type",
			"created_by { objectId first_name last_name }",
			"property { objectId name }",
			"task { objectId title }",
			"file { name url }"
		],
		filters: paramsHandler(id, type),
		order: "createdAt_DESC"
	});

	return {
		loading,
		data,
		refetch
	};
};

export default useFindObjectsDocuments;
