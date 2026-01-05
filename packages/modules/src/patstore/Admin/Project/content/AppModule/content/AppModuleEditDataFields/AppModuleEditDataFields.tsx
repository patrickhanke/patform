import React, { useCallback, useState } from "react";
import {
	CreateButton,
	DnDDisplay,
	SlideIn,
	sortItemsByPosition
} from "@repo/ui";
import { useImmer } from "use-immer";
import AppModuleField from "./components/AppModuleField";
import { AppModuleEditFieldsProps } from "./types";
import { Field } from "@repo/ui";
import { v4 } from "uuid";
import { useDataHandler } from "@repo/provider";
import AppModuleEditField from "./components/AppModuleEditField";

const AppModuleEditDataFields = ({
	moduleId,
	initialFields
}: AppModuleEditFieldsProps) => {
	const { updateData } = useDataHandler(false, false);
	const [editFields, setEditFields] = React.useState(false);
	const [loading, setLoading] = useState(false);
	const [dataFields, setDataFields] = useImmer<Field[]>(initialFields || []);
	const [activeField, setActiveField] = React.useState("");

	const slideInConfirmHandler = useCallback(async () => {
		setLoading(true);
		await updateData({
			className: "Module",
			objectId: moduleId,
			updateObject: {
				data_fields: dataFields
			}
		});

		setEditFields(false);
		setLoading(false);
	}, [dataFields]);

	const findActiveField = useCallback(
		(id: string) => {
			return dataFields.find((field) => field.id === id);
		},
		[dataFields, editFields, activeField]
	);

	const deleteField = useCallback(
		(id: string) => {
			setDataFields((draft) => {
				return draft.filter((field) => field.id !== id);
			});
		},
		[dataFields]
	);
	return (
		<div>
			<button
				className="full_button sm green"
				onClick={() => setEditFields(true)}
			>
				Datenfelder bearbeiten
			</button>
			<SlideIn
				cancel={() => setEditFields(false)}
				confirm={() => slideInConfirmHandler()}
				isOpen={editFields}
				header="Datenfelder bearbeiten"
				showSecondaryContent={!!activeField}
				secondaryContent={
					<AppModuleEditField
						field={findActiveField(activeField)}
						setFields={setDataFields}
					/>
				}
				loading={loading}
				disabled={[loading, loading]}
			>
				<div>
					<div>
						<CreateButton
							text="Datenfeld hinzufügen"
							size="medium"
							onClick={() => {
								setDataFields((draft) => {
									draft.push({
										type: "input",
										label: "Neues Feld",
										name: "",
										validation: {
											required: ""
										},
										position: draft.length + 1,
										id: v4() as string
									});
								});
							}}
						/>
					</div>
					<div>
						<DnDDisplay<Field[]>
							items={
								(sortItemsByPosition(dataFields) as Field[]) ||
								[]
							}
							ItemComponent={({ item }) => (
								<AppModuleField
									field={item as Field}
									setActiveField={setActiveField}
									deleteField={deleteField}
								/>
							)}
							objectClass="Module"
							subField={{ id: moduleId, field: "dataFields" }}
						/>
					</div>
				</div>
			</SlideIn>
		</div>
	);
};

export default AppModuleEditDataFields;
