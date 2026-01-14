import React, { FC } from "react";
import { IconButton, Modal } from "@repo/ui";
import { FormFieldProps } from "./types";
import CreateField from "../CreateField";
import { useDataHandler } from "@repo/provider";

const FormField: FC<FormFieldProps> = ({ formId, field, refetch, fields }) => {
	const [editField, setEditField] = React.useState(false);
	const [deleteField, setDeleteField] = React.useState(false);
	const { updateData } = useDataHandler();

	return (
		<div className="flex row a-ce j-sb">
			{field.label || "..."}
			<div className="button_container">
				<IconButton icon="edit" onClick={() => setEditField(true)} />
				<IconButton
					icon="delete"
					onClick={() => setDeleteField(true)}
				/>
			</div>
			{editField && (
				<CreateField
					field={field}
					createField={editField}
					setCreateField={setEditField}
					formId={formId}
					fields={fields}
					refetch={refetch}
				/>
			)}
			<Modal
				isOpen={deleteField}
				cancelButtonHandler={() => setDeleteField(false)}
				confirmButtonHandler={async () => {
					const currentFieldIndex = fields.findIndex(
						(f) => f.id === field.id
					);
					if (currentFieldIndex !== -1) {
						const newFields = [...fields];
						newFields.splice(currentFieldIndex, 1);
						await updateData({
							className: "Form",
							objectId: formId,
							updateObject: {
								fields: newFields
							},
							feedback: "Feld gelöscht"
						});
					}
					await refetch();
					setDeleteField(false);
				}}
				header="Feld löschen"
			>
				<p>
					Möchten Sie dieses Feld wirklich löschen? Diese Aktion kann
					nicht rückgängig gemacht werden.
				</p>
			</Modal>
		</div>
	);
};

export default FormField;
