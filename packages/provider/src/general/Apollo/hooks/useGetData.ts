import { useQuery } from "@apollo/client";
import { UseGetDataHook } from "../types";
import { Classes } from "../../../../../types/src/patstore";
import generateGraphQLQuery_4_1 from "../functions/generateGraphQlQuery_4_1";
import { get } from "lodash-es";
import { sanitizeGraphQlNode } from "../functions/helpers";

const useGetData: UseGetDataHook<Classes> = ({
	objectName,
	fields,
	id,
	skip
}) => {
	const cleanObjectName = objectName.replace(/_/g, "");
	console.log({ cleanObjectName });
	const { loading, data, refetch, error } = useQuery(
		generateGraphQLQuery_4_1({
			type: "get",
			objectName: cleanObjectName,
			queryName: cleanObjectName.toLowerCase(),
			fields
		}),
		{
			variables: {
				id
			},
			skip: skip || !id
		}
	);

	return {
		loading,
		data: sanitizeGraphQlNode<Classes>(
			get(data, `${cleanObjectName.toLowerCase()}`, null)
		),
		refetch,
		error
	};
};

export default useGetData;
