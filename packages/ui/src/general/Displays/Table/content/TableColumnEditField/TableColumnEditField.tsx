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
	dataFields,
	type = "data"
}: TableColumnEditFieldProps) => {
	const { updateData } = useDataHandler();
	const [data, setData] = useState(null as unknown as Class["data"]);
	const [isOpen, setIsOpen] = useState(false);

	console.log(type);
	console.log(data);
	console.log(dataFields);

	const { loading, refetch } = useQuery(
		generateGraphQLQuery({
			type: "get",
			objectName: className,
			fields: ["objectId", "data", "settings"]
		}),
		{
			variables: { id: objectId },
			onCompleted: (response) => {
				const newData = get(
					response,
					`objects.get${className}.${type === "data" ? "data" : "settings"}`,
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
					[type === "data" ? "data" : "settings"]: {
						...values
					}
				},
				feedback:
					type === "data"
						? "Daten aktualisiert"
						: "Einstellung aktualisiert"
			});
			await refetch();
			setIsOpen(false);
		},
		[data]
	);

	return (
		<>
			<IconButton
				icon={type === "data" ? "edit" : "settings"}
				onClick={() => setIsOpen(true)}
				disabled={loading}
			/>
			<SlideInForm
				isOpen={isOpen}
				data={data}
				setIsOpen={() => setIsOpen(false)}
				fields={dataFields || []}
				title={
					type === "data"
						? "Daten bearbeiten"
						: "Einstellung bearbeiten"
				}
				dataHandler={dataHandler}
				isHorizontal
			/>
		</>
	);
};

export default TableColumnEditField;
