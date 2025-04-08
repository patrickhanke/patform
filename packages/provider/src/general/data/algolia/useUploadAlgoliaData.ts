"use client";

import { useEffect } from "react";
import { Classes } from "@repo/types";

import { algoliasearch } from "algoliasearch";

const client = algoliasearch("DV1RK4HUDW", "451f606e2f39a15f61395340e9ae8405");

const useUploadAlgoliaData = <T extends Classes[]>({
	data,
	entry
}: {
	data: Array<{ [key in keyof T]: string }>;
	entry: string;
}) => {
	const processRecords = async () => {
		return await client.saveObjects({
			indexName: entry,
			objects: data.map(
				(item) => ({ ...item }) as Record<string, unknown>
			)
		});
	};

	useEffect(() => {
		console.log({ data });
		if (data) {
			processRecords();
		}
	}, [data]);
};

export default useUploadAlgoliaData;
