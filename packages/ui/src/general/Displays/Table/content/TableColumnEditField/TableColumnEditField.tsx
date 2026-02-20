"use client";

import { useCallback, useEffect, useState } from "react";
import { IconButton, SlideInForm } from "@repo/ui";
import { useDataHandlerSecure, useGetData } from "@repo/provider";
import {
	TableColumnEditFieldComponent,
	TableColumnEditFieldProps
} from "./types";
import { Classes } from "@repo/types";
import { FormikValues } from "formik";

const TableColumnEditField: TableColumnEditFieldComponent = <
	Class extends Classes
>({
	objectId,
	className,
	dataFields,
	type = "data"
}: TableColumnEditFieldProps) => {
	const { updateData } = useDataHandlerSecure(true);
	const [data, setData] = useState(null as unknown as Class["data"]);
	const [isOpen, setIsOpen] = useState(false);

	const {
		data: dataFromGetData,
		loading,
		refetch
	} = useGetData({
		objectName: className,
		fields: ["objectId", "data", "settings"],
		id: objectId,
		skip: !isOpen
	});

	useEffect(() => {
		if (dataFromGetData && !data) {
			if (type === "data") {
				setData(dataFromGetData.data);
			} else {
				setData(dataFromGetData.settings);
			}
		}
	}, [dataFromGetData, type]);

	console.log({ dataFromGetData });
	console.log({ data });
	console.log({ type });

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
		[updateData, objectId, className, type, refetch]
	);

	return (
		<>
			<IconButton
				icon={type === "data" ? "edit" : "settings"}
				onClick={() => setIsOpen(true)}
				disabled={loading}
			/>
			{!loading && (
				<SlideInForm
					isOpen={isOpen}
					data={data}
					setIsOpen={() => setIsOpen(false)}
					fields={dataFromGetData ? dataFields : []}
					title={
						type === "data"
							? "Daten bearbeiten"
							: "Einstellung bearbeiten"
					}
					dataHandler={dataHandler}
					isHorizontal
				/>
			)}
		</>
	);
};

export default TableColumnEditField;
