"use client";

import { useCallback, useContext, useState } from "react";
import { useQuery } from "@apollo/client";
import { IconButton, SlideInForm } from "@repo/ui";
import {
	PatstoreAppContext,
	generateGraphQLQuery,
	useDataHandler
} from "@repo/provider";
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
	className
}: TableColumnEditFieldProps) => {
	const { updateData } = useDataHandler();
	const { currentModule } = useContext(PatstoreAppContext);
	const [data, setData] = useState(null as unknown as Class["data"]);
	const [isOpen, setIsOpen] = useState(false);

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
					data{
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
				setIsOpen={() => setIsOpen(false)}
				fields={currentModule.fields || []}
				title="Objekt bearbeiten"
				dataHandler={dataHandler}
			/>
		</>
	);
};

export default TableColumnEditField;
