"use client";

import React, { useContext, useState } from "react";
import { useCallback } from "react";
import { ApolloClient, InMemoryCache, gql } from "@apollo/client";
import { DataObject, DataTranferProps, DataValue } from "./types";
import { get } from "lodash-es";
import { PatstoreAppContext, useDataHandler } from "@repo/provider";
import checkDataElement from "./functions/checkDataEements";
import { Classes } from "@repo/types";

const DataTransfer = <T extends Classes, D extends object>({
	sourceClassName,
	targetClassName,
	moduleId,
	query,
	url,
	appId,
	masterKey,
	propertyMapping
}: DataTranferProps<T, D>) => {
	const { project } = useContext(PatstoreAppContext);
	const { createData } = useDataHandler();
	const [data, setData] = useState<T | null>(null);
	const client = new ApolloClient({
		uri: url,
		headers: {
			"X-Parse-Application-Id": appId,
			"X-Parse-Master-Key": masterKey
		},
		cache: new InMemoryCache()
	});

	const fetchQuery = useCallback(
		async (preview: boolean) => {
			let dataObjects;
			try {
				const response = await client.query({
					query: gql`
						${query}
					`
				});
				dataObjects = get(
					response,
					`data.objects.find${sourceClassName}.results`,
					[]
				);

				setData(response.data);
			} catch (error) {
				console.error("Error fetching data:", error);
			}

			const transformedData = dataObjects.map((dataObject: T) => {
				const transformedObject = propertyMapping(dataObject) as T;
				// for (const [inputKey] of Object.entries(propertyMapping)) {
				// 	if (typeof propertyMapping[inputKey] === "function") {
				// 		transformedObject[inputKey] =
				// 			propertyMapping[inputKey](dataObject);
				// 	} else {
				// 		transformedObject[inputKey] = dataObject[inputKey];
				// 	}
				// }
				return transformedObject;
			});
			if (preview) {
				console.log("Preview Data:", transformedData);
				return transformedData;
			}

			const updateTransformedData = await Promise.all(
				transformedData.map(async (dataElement: DataObject) => {
					const dataElementCopy = await checkDataElement({
						dataElement,
						projectPath: project.path
					});
					return dataElementCopy;
				})
			);
			console.log({ updateTransformedData });

			await Promise.all(
				updateTransformedData.map(async (dataElement) => {
					const dataElementCopy = await createData({
						className: targetClassName,
						updateObject: {
							...dataElement,
							module: {
								__type: "Pointer",
								className: "Module",
								objectId: moduleId
							}
						}
					});
					return dataElementCopy;
				})
			);

			return updateTransformedData;
		},
		[query, url, appId, masterKey]
	);

	console.log(data);

	return (
		<div>
			<button
				className="button_full md light"
				onClick={() => fetchQuery(true)}
			>
				Preview
			</button>
			<button
				className="button_full md dark"
				onClick={() => fetchQuery(false)}
			>
				Transport
			</button>
		</div>
	);
};

export default DataTransfer;
