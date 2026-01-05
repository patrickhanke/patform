"use client";

import { useCallback, useState } from "react";
import { useQuery } from "@apollo/client";
import { IconButton, SlideInForm } from "@repo/ui";
import { generateGraphQLQuery, useDataHandler } from "@repo/provider";
import {
	TableColumnEditFieldComponent,
	TableColumnEditFieldProps
} from "./types";
import { Classes } from "@repo/types";
import { get } from "lodash-es";
import { FormikValues } from "formik";

const TableColumnEditField: TableColumnEditFieldComponent = <
	Class extends Classes
>({
	objectId,
	className,
	dataFields
}: TableColumnEditFieldProps) => {
	const { updateData } = useDataHandler();
	const [data, setData] = useState(null as unknown as Class["data"]);
	const [isOpen, setIsOpen] = useState(false);

	console.log(data);
	console.log(dataFields);

	const { loading, refetch } = useQuery(
		generateGraphQLQuery({
			type: "get",
			objectName: className,
			fields: ["objectId", "data"]
		}),
		{
			variables: { id: objectId },
			onCompleted: (response) => {
				const newData = get(
					response,
					`objects.get${className}.data`,
					null
				);

				setData(newData);
			},
			skip: !isOpen
		}
	);

	const dataHandler = useCallback(
		async (values: FormikValues) => {
			await updateData({
				objectId: objectId,
				className,
				updateObject: {
					data: {
						...values
					}
				},
				feedback: "Daten aktualisiert"
			});
			await refetch();
			setIsOpen(false);
		},
		[data]
	);

	return (
		<>
			<IconButton
				icon="edit"
				onClick={() => setIsOpen(true)}
				disabled={loading}
			/>
			<SlideInForm
				isOpen={isOpen}
				data={data}
				setIsOpen={() => setIsOpen(false)}
				fields={dataFields || []}
				title="Objekt bearbeiten"
				dataHandler={dataHandler}
			/>
		</>
	);
};

export default TableColumnEditField;
