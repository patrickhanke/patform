"use client";

import { useQuery } from "@apollo/client";
import { UseGetDataHook } from "../types";
import { Classes } from "../../../../../types/src/patstore";
import generateGraphQLQuery_4_1 from "../functions/generateGraphQlQuery_4_1";
import { get } from "lodash-es";
import { sanitizeGraphQlNode } from "../functions/helpers";
import { useEffect } from "react";

const useGetData: UseGetDataHook<Classes> = ({
	objectName,
	fields,
	id,
	skip,
	afterSaveHandler
}) => {
	const cleanObjectName = objectName.replace(/_/g, "");
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

	useEffect(() => {
		if (afterSaveHandler && data) {
			afterSaveHandler(data);
		}
	}, [data]);

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
