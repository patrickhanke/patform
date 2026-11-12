"use client";

import { useCallback, useState } from "react";
import { IconButton, SlideInForm } from "@repo/ui";
import { useDataHandlerSecure, useGetData } from "@repo/provider";
import {
	TableColumnEditFieldComponent,
	TableColumnEditFieldProps
} from "./types";
import { Classes } from "@repo/types";
import { FormikValues } from "formik";
import {
	formatFormDataForFields,
	normalizeFormDataForFields
} from "./functions/normalizeFormData";

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
		skip: !isOpen,
		afterSaveHandler: (serverData) => {
			const slice =
				type === "data" ? serverData.data : serverData.settings;
			setData(
				normalizeFormDataForFields(
					slice as Record<string, unknown> | null | undefined,
					dataFields
				) as Class["data"]
			);
		}
	});

	const dataHandler = useCallback(
		async (values: FormikValues) => {
			const payload = formatFormDataForFields(
				values as Record<string, unknown>,
				dataFields
			);
			await updateData({
				objectId: objectId,
				className,
				updateObject: {
					[type === "data" ? "data" : "settings"]: {
						...payload
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
		[updateData, objectId, className, type, refetch, dataFields]
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
