"use client";

import { useQuery } from "@apollo/client";
import { UseGetDataParams, UseGetDataResult } from "../types";
import { Classes } from "@repo/types";
import generateGraphQLQuery_4_1 from "../functions/generateGraphQlQuery_4_1";
import { get } from "lodash-es";
import { sanitizeGraphQlNode } from "../functions/helpers";
import { useEffect } from "react";

const useGetData = <T extends Classes = Classes>({
	objectName,
	fields,
	id,
	skip,
	afterSaveHandler
}: UseGetDataParams<T>): UseGetDataResult<T> => {
	const cleanObjectName = objectName.replace(/_/g, "");
	const { data, refetch, error, loading } = useQuery(
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

	const sanitizedData = sanitizeGraphQlNode<T>(
		get(data, `${cleanObjectName.toLowerCase()}`, null)
	);

	useEffect(() => {
		if (afterSaveHandler && data && sanitizedData) {
			afterSaveHandler(sanitizedData);
		}
	}, [data]);

	return {
		loading: skip || !id ? false : loading,
		data: sanitizedData,
		refetch,
		error
	};
};

export default useGetData;
