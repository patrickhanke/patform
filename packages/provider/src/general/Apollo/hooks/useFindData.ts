import { useQuery } from "@apollo/client";
import { UseFindDataHook } from "../types";
import { Classes } from "../../../../../types/src/patstore";
import generateGraphQLQuery_4_1 from "../functions/generateGraphQlQuery_4_1";
import { get } from "lodash-es";
import { pluralize, sanitizeGraphQlNode } from "../functions/helpers";
import paramsHandler from "../functions/paramsHandler";

const useFindData: UseFindDataHook<Classes> = ({
	objectName,
	fields,
	filters = [],
	limit,
	skip,
	order,
	moduleId,
	projectId
}) => {
	const queryName = pluralize(objectName);

	const { loading, data, refetch, error } = useQuery(
		generateGraphQLQuery_4_1({
			type: "find",
			objectName,
			queryName,
			fields
		}),
		{
			variables: {
				params: paramsHandler({ moduleId, projectId, filters }),
				first: limit,
				skip,
				order: order || "createdAt_DESC"
			}
		}
	);

	return {
		loading,
		data: get(data, `${queryName}.edges`, []).map(
			(edge: { node: Classes }) => sanitizeGraphQlNode<Classes>(edge.node)
		),
		refetch,
		count: get(data, `${queryName}.count`, 0),
		error
	};
};

export default useFindData;
