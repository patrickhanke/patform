"use client";

import { useCallback, useMemo } from "react";
import { DnDDisplay, sortItemsByPosition, usePageData } from "@repo/ui";
import { ModuleField } from "@repo/types";
import AppModuleField from "./components/AppModuleField";
import { AppModuleEditFieldsProps, ModuleFieldsPageData } from "./types";
import generateInitialFields from "./functions/generateInitialFields";

const AppModuleEditFields = ({
	objectId,
	initialFields,
	modulePath,
	updateOptions
}: AppModuleEditFieldsProps) => {
	const initialData = useMemo(
		() => ({
			fields: generateInitialFields(initialFields || [], modulePath)
		}),
		[initialFields, modulePath]
	);

	const { data, setData } = usePageData<ModuleFieldsPageData>(
		{ initialData, objectId },
		updateOptions
	);

	const fields = data?.fields ?? [];

	const changeField = useCallback(
		(field: ModuleField) => {
			setData(
				"fields",
				fields.map((item) => (item.id === field.id ? field : item))
			);
		},
		[fields, setData]
	);

	if (!data) return null;

	return (
		<div className="content_element">
			<DnDDisplay<ModuleField[]>
				items={sortItemsByPosition(fields) || []}
				ItemComponent={({ item }) => (
					<AppModuleField
						key={`${item.id}_${item.type}`}
						field={item as ModuleField}
						changeField={changeField}
						modulePath={modulePath}
					/>
				)}
				onChange={(newFields) => {
					setData(
						"fields",
						newFields.map((field, index) => ({
							...field,
							position: index + 1
						}))
					);
				}}
			/>
		</div>
	);
};

export default AppModuleEditFields;
