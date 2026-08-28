"use client";

import { useQuery } from "@apollo/client";
import { UseFindDataHook } from "../types";
import { Classes, LanguageValue } from "@repo/types";
import generateGraphQLQuery_4_1 from "../functions/generateGraphQlQuery_4_1";
import { get } from "lodash-es";
import { pluralize, sanitizeGraphQlNode } from "../functions/helpers";
import paramsHandler from "../functions/paramsHandler";
import { useCallback, useState } from "react";

const useFindData: UseFindDataHook<Classes> = ({
	objectName,
	fields,
	filters = [],
	limit = 500,
	skip,
	order,
	moduleId,
	projectId,
	userId,
	skipQuery = false,
	pollInterval = 0,
	propertyId,
	userIds,
	absenceId,
	defaultLanguage
}) => {
	const [language, setLanguage] = useState<LanguageValue | undefined>(
		defaultLanguage
	);
	const queryName = pluralize(objectName);
	const {
		loading,
		data,
		refetch: apolloRefetch,
		error
	} = useQuery(
		generateGraphQLQuery_4_1({
			type: "find",
			objectName,
			queryName,
			fields,
			is_user_class: objectName === "User" || objectName === "_User"
		}),
		{
			variables: {
				params: paramsHandler({
					language,
					moduleId,
					projectId,
					filters,
					userId,
					propertyId,
					userIds,
					absenceId
				}),
				first: limit,
				skip,
				order: order || "createdAt_DESC"
			},
			skip: skipQuery,
			pollInterval: pollInterval
		}
	);

	const refetch = useCallback(async () => {
		return await apolloRefetch();
	}, [apolloRefetch]);

	const changeLanguage = useCallback(
		(language: LanguageValue) => {
			setLanguage(language);
			refetch();
		},
		[setLanguage]
	);

	return {
		loading,
		data: get(data, `${queryName}.edges`, []).map(
			(edge: { node: Classes }) => sanitizeGraphQlNode<Classes>(edge.node)
		),
		refetch,
		count: get(data, `${queryName}.count`, 0),
		error,
		changeLanguage,
		language
	};
};

export default useFindData;
