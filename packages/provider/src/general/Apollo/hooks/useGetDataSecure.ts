"use client";

import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { UseGetDataHook } from "../types";
import { Classes } from "../../../../../types/src/patstore";
import generateGraphQLQuery_4_1 from "../functions/generateGraphQlQuery_4_1";
import { get } from "lodash-es";
import { sanitizeGraphQlNode } from "../functions/helpers";
import { print } from "graphql";

const useGetDataSecure: UseGetDataHook<Classes> = ({
	objectName,
	fields,
	id,
	skip = false,
	afterSaveHandler,
	useMasterKey = false
}) => {
	const [loading, setLoading] = useState(!skip && !!id);
	const [data, setData] = useState<Classes | null>(null);
	const [error, setError] = useState<any>(null);
	
	const isMountedRef = useRef(true);
	const cleanObjectName = objectName.replace(/_/g, "");

	// Stabilize array dependency to prevent infinite loops
	const fieldsKey = useMemo(() => JSON.stringify(fields), [fields]);

	const fetchData = useCallback(async () => {
		if (skip || !id) {
			setLoading(false);
			return;
		}

		try {
			setLoading(true);
			setError(null);

			const query = generateGraphQLQuery_4_1({
				type: "get",
				objectName: cleanObjectName,
				queryName: cleanObjectName.toLowerCase(),
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
					variables: { id },
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

			const newData = sanitizeGraphQlNode<Classes>(
				get(result.data, `${cleanObjectName.toLowerCase()}`, null)
			);

			setData(newData);
			setLoading(false);

			// Trigger afterSaveHandler if provided
			if (afterSaveHandler && newData) {
				afterSaveHandler(newData);
			}
		} catch (err: any) {
			if (!isMountedRef.current) return;
			setError(err);
			setLoading(false);
		}
	}, [objectName, cleanObjectName, fieldsKey, id, skip, afterSaveHandler, useMasterKey]);

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

	return {
		loading,
		data,
		refetch,
		error
	};
};

export default useGetDataSecure;
