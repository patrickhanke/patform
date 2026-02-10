"use client";

import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { UseFindDataHook } from "../types";
import { Classes } from "../../../../../types/src/patstore";
import generateGraphQLQuery_4_1 from "../functions/generateGraphQlQuery_4_1";
import { get } from "lodash-es";
import { pluralize, sanitizeGraphQlNode } from "../functions/helpers";
import paramsHandler from "../functions/paramsHandler";
import { print } from "graphql";

const useFindDataSecure: UseFindDataHook<Classes> = ({
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
	useMasterKey = false
}) => {
	const [loading, setLoading] = useState(!skipQuery);
	const [data, setData] = useState<Classes[]>([]);
	const [count, setCount] = useState(0);
	const [error, setError] = useState<any>(null);

	const pollIntervalRef = useRef<NodeJS.Timeout | null>(null);
	const isMountedRef = useRef(true);

	const queryName = pluralize(objectName);

	// Stabilize array dependencies to prevent infinite loops
	const fieldsKey = useMemo(() => JSON.stringify(fields), [fields]);
	const filtersKey = useMemo(() => JSON.stringify(filters), [filters]);

	const fetchData = useCallback(async () => {
		if (skipQuery) {
			setLoading(false);
			return;
		}

		try {
			setLoading(true);
			setError(null);

			const query = generateGraphQLQuery_4_1({
				type: "find",
				objectName,
				queryName,
				fields
			});

			const queryString = print(query);
			const response = await fetch("/api/graphql", {
				method: "POST",
				headers: {
					"Content-Type": "application/json"
				},
				body: JSON.stringify({
					query: queryString,
					variables: {
						params: paramsHandler({
							moduleId,
							projectId,
							filters,
							userId
						}),
						first: limit,
						skip,
						order: order || "createdAt_DESC"
					},
					useMasterKey
				})
			});

			const result = await response.json();

			if (!isMountedRef.current) return;

			if (result.errors) {
				setError(result.errors[0]);
				setLoading(false);
				return;
			}

			const edges = get(result.data, `${queryName}.edges`, []);
			const newData = edges.map((edge: { node: Classes }) =>
				sanitizeGraphQlNode<Classes>(edge.node)
			);
			const newCount = get(result.data, `${queryName}.count`, 0);

			setData(newData);
			setCount(newCount);
			setLoading(false);
		} catch (err: any) {
			if (!isMountedRef.current) return;
			setError(err);
			setLoading(false);
		}
	}, [
		objectName,
		queryName,
		fieldsKey,
		filtersKey,
		limit,
		skip,
		order,
		moduleId,
		projectId,
		userId,
		skipQuery,
		useMasterKey
	]);

	const refetch = useCallback(async () => {
		await fetchData();
		return { data: null } as any; // Match Apollo's refetch return type
	}, [fetchData]);

	useEffect(() => {
		isMountedRef.current = true;
		fetchData();

		return () => {
			isMountedRef.current = false;
		};
	}, [fetchData]);

	// Handle polling
	useEffect(() => {
		if (pollInterval > 0 && !skipQuery) {
			pollIntervalRef.current = setInterval(() => {
				fetchData();
			}, pollInterval);

			return () => {
				if (pollIntervalRef.current) {
					clearInterval(pollIntervalRef.current);
				}
			};
		}
	}, [pollInterval, skipQuery, fetchData]);

	return {
		loading,
		data,
		refetch,
		count,
		error
	};
};

export default useFindDataSecure;
