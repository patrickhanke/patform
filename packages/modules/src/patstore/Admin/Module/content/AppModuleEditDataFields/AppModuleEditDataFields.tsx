"use client";

import { useCallback, useRef, useState } from "react";
import {
	CreateButton,
	Divider,
	DnDDisplay,
	SlideIn,
	sortItemsByPosition,
	usePageData
} from "@repo/ui";
import { Field, ErrorMessage } from "@repo/types";
import { v4 } from "uuid";
import { cloneDeep } from "lodash-es";
import { useDataHandlerSecure } from "@repo/provider";
import AppModuleField from "./components/AppModuleField";
import AppModuleEditField from "./components/AppModuleEditField";
import { AppModuleEditFieldsProps, ModuleDataFieldsPageData } from "./types";

const AppModuleEditDataFields = ({
	objectId,
	initialFields,
	updateOptions,
	refetch
}: AppModuleEditFieldsProps) => {
	const { data, setData } = usePageData<ModuleDataFieldsPageData>(
		{ initialData: { data_fields: initialFields || [] }, objectId },
		updateOptions
	);
	const { updateData } = useDataHandlerSecure();
	const [activeField, setActiveField] = useState("");
	const [saving, setSaving] = useState(false);
	const [errors, setErrors] = useState<ErrorMessage[]>([]);
	const draftRef = useRef<Field | null>(null);

	const dataFields = data?.data_fields ?? [];

	const findActiveField = useCallback(
		(id: string) => dataFields.find((field) => field.id === id),
		[dataFields]
	);

	const openEditor = useCallback(
		(id: string) => {
			const found = dataFields.find((item) => item.id === id);
			draftRef.current = found ? cloneDeep(found) : null;
			setActiveField(id);
		},
		[dataFields]
	);

	const deleteField = useCallback(
		(id: string) => {
			setData(
				"data_fields",
				dataFields.filter((field) => field.id !== id)
			);
			if (activeField === id) {
				setActiveField("");
			}
		},
		[activeField, dataFields, setData]
	);

	const handleLocalChange = useCallback((draft: Field) => {
		draftRef.current = draft;
	}, []);

	const closeEditor = useCallback(() => {
		draftRef.current = null;
		setErrors([]);
		setActiveField("");
	}, []);

	const confirmEditor = useCallback(async () => {
		const draft = draftRef.current;
		if (!draft) {
			closeEditor();
			return;
		}

		const nextFields = dataFields.map((item) =>
			item.id === draft.id ? draft : item
		);

		setSaving(true);
		setErrors([]);

		let failed = false;
		await updateData({
			className: "Module",
			objectId,
			updateObject: {
				data_fields: nextFields
			},
			feedback: "Datenfelder gespeichert",
			onError: (message) => {
				failed = true;
				setErrors([
					{
						id: "save",
						key: "save",
						message
					}
				]);
			}
		});

		setSaving(false);
		if (failed) return;

		await refetch();
		closeEditor();
	}, [closeEditor, dataFields, objectId, refetch, updateData]);

	const activeFieldData = findActiveField(activeField);

	if (!data) return null;

	return (
		<div className="content_element">
			<CreateButton
				text="Datenfeld hinzufügen"
				size="medium"
				onClick={() => {
					setData("data_fields", [
						...dataFields,
						{
							type: "input",
							label: "Neues Feld",
							name: "",
							validation: {
								required: ""
							},
							position: dataFields.length + 1,
							id: v4()
						} as Field
					]);
				}}
			/>
			<Divider size="small" showLine={false} />
			<DnDDisplay<Field[]>
				items={sortItemsByPosition(dataFields) || []}
				ItemComponent={({ item }) => (
					<AppModuleField
						field={item as Field}
						setActiveField={openEditor}
						deleteField={deleteField}
					/>
				)}
				onChange={(newFields) => {
					setData(
						"data_fields",
						newFields.map((field, index) => ({
							...field,
							position: index + 1
						}))
					);
				}}
			/>
			<SlideIn
				isOpen={!!activeFieldData}
				header="Datenfeld bearbeiten"
				cancel={closeEditor}
				confirm={confirmEditor}
				loading={saving}
				disabled={[saving, saving]}
				errors={errors}
			>
				{activeFieldData ? (
					<AppModuleEditField
						key={activeFieldData.id}
						field={cloneDeep(activeFieldData)}
						onChange={handleLocalChange}
					/>
				) : null}
			</SlideIn>
		</div>
	);
};

export default AppModuleEditDataFields;
