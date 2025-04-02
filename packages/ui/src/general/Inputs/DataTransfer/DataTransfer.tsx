"use client";

import React, { FC, useContext, useState } from "react";
import { useCallback } from "react";
import { ApolloClient, InMemoryCache, gql } from "@apollo/client";
import { DataObject, DataTranferProps } from "./types";
import { get } from "lodash-es";
import { PatstoreAppContext, useDataHandler } from "@repo/provider";
import checkDataElement from "./functions/checkDataEements";

const DataTransfer: FC<DataTranferProps> = ({
	sourceClassName,
	targetClassName,
	moduleId,
	query,
	url,
	appId,
	masterKey,
	propertyMapping
}) => {
	const { project } = useContext(PatstoreAppContext);
	const { createData } = useDataHandler();
	const [data, setData] = useState(null);
	const client = new ApolloClient({
		uri: url,
		headers: {
			"X-Parse-Application-Id": appId,
			"X-Parse-Master-Key": masterKey
		},
		cache: new InMemoryCache()
	});

	const fetchQuery = useCallback(async () => {
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

		const transformedData: DataObject[] = dataObjects.map(
			(dataObject: DataObject) => {
				const transformedObject: DataObject = {};
				for (const [inputKey, outputKey] of Object.entries(
					propertyMapping
				)) {
					transformedObject[outputKey] = dataObject[inputKey];
				}
				return transformedObject;
			}
		);
		console.log("Transformed Data:", transformedData);
		const updateTransformedData = await Promise.all(
			transformedData.map(async (dataElement) => {
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
	}, [query, url, appId, masterKey]);

	console.log(data);

	return (
		<div>
			<button onClick={() => fetchQuery()}>Preview</button>
			<button>Transport</button>
		</div>
	);
};

export default DataTransfer;
