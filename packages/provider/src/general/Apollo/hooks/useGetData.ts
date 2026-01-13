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
	const { loading, data, refetch } = useQuery(
		generateGraphQLQuery_4_1({
			type: "get",
			objectName,
			queryName: objectName.toLowerCase(),
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
			get(data, `${objectName.toLowerCase()}`, null)
		),
		refetch
	};
};

export default useGetData;
