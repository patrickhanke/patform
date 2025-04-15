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

const AppModuleEditFields = ({
	moduleId,
	initialFields
}: AppModuleEditFieldsProps) => {
	const { updateData } = useDataHandler();
	const [editFields, setEditFields] = React.useState(false);
	const [loading, setLoading] = useState(false);
	const [fields, setFields] = useImmer<Field[]>(initialFields || []);
	const [activeField, setActiveField] = React.useState("");

	const slideInConfirmHandler = useCallback(async () => {
		setLoading(true);
		await updateData({
			className: "Module",
			objectId: moduleId,
			updateObject: {
				fields: fields
			}
		});

		setEditFields(false);
		setLoading(false);
	}, [fields]);

	const findActiveField = useCallback(
		(id: string) => {
			return fields.find((field) => field.id === id);
		},
		[fields, editFields, activeField]
	);

	return (
		<div>
			<button
				className="full_button sm green"
				onClick={() => setEditFields(true)}
			>
				Felder bearbeiten
			</button>
			<SlideIn
				cancel={() => setEditFields(false)}
				confirm={() => slideInConfirmHandler()}
				isOpen={editFields}
				header="Felder bearbeiten"
				showSecondaryContent={!!activeField}
				secondaryContent={
					<AppModuleEditField
						field={findActiveField(activeField)}
						setFields={setFields}
					/>
				}
				disabled={[loading, loading]}
			>
				<div>
					<div>
						<CreateButton
							text="Feld hinzufügen"
							size="medium"
							onClick={() => {
								setFields((draft) => {
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
								(sortItemsByPosition(fields) as Field[]) || []
							}
							ItemComponent={({ item }) => (
								<AppModuleField
									field={item as Field}
									setActiveField={setActiveField}
								/>
							)}
							objectClass="Module"
							subField={{ id: moduleId, field: "fields" }}
						/>
					</div>
				</div>
			</SlideIn>
		</div>
	);
};

export default AppModuleEditFields;
