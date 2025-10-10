"use client";

import { AdminPage } from "@repo/modules";
import { useQuery } from "@apollo/client";
import { generateGraphQLQuery, useDataHandler } from "@repo/provider";
import { useCallback } from "react";

const Playground = () => {
	const { updateData } = useDataHandler(true, false);
	const { data } = useQuery(
		generateGraphQLQuery({
			type: "find",
			objectName: "Person",
			fields: ["objectId", "portrait", "name"]
		})
	);

	const dataHandler = useCallback(async () => {
		const dataArray = data?.objects?.findPerson?.results;

		console.log({ dataArray });
		if (!dataArray) return;

		const updateArray = dataArray.map((dataElement) =>
			updateData({
				className: "Person",
				objectId: dataElement.objectId,
				updateObject: {
					title: dataElement.name,
					image: dataElement.portrait
				}
			})
		);
		await Promise.all(updateArray);
	}, [data]);

	console.log({ data });
	return (
		<AdminPage title={"Playground"} emptyContent={true}>
			<p>Playground</p>
			<button disabled={!data} onClick={() => dataHandler()}>
				Click
			</button>
		</AdminPage>
	);
};

export default Playground;
