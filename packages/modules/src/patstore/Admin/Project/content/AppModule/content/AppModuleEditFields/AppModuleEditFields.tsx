import React, { useCallback, useEffect, useState } from "react";
import { DnDDisplay, SlideIn, sortItemsByPosition } from "@repo/ui";
import AppModuleField from "./components/AppModuleField";
import { AppModuleEditFieldsProps, ModuleFieldsPartial } from "./types";
import { useDataHandler } from "@repo/provider";
import generateInitialFields from "./functions/generateInitialFields";
import { useImmer } from "use-immer";
import { ModuleField } from "@repo/types";

const AppModuleEditFields: React.FC<AppModuleEditFieldsProps> = ({
	moduleId,
	modulePath,
	initialFields,
	refetch,
	moduleName
}) => {
	const { updateData } = useDataHandler(false, false);
	const [editFields, setEditFields] = React.useState(false);
	const [loading, setLoading] = useState(false);
	const [fields, setFields] = useImmer<ModuleFieldsPartial>([]);
	console.log("modulePath");
	console.log(modulePath);
	console.log("initialFields");
	console.log(initialFields);
	useEffect(() => {
		setFields(generateInitialFields(initialFields, modulePath));
	}, [editFields, initialFields, modulePath]);

	const slideInConfirmHandler = useCallback(async () => {
		setLoading(true);
		const fieldsCopy = [...fields].sort((a, b) => a.position - b.position);
		await updateData({
			className: "Module",
			objectId: moduleId,
			updateObject: {
				fields: fieldsCopy
			}
		});

		await refetch();

		setEditFields(false);
		setLoading(false);
	}, [fields]);

	const changeField = useCallback(
		(field: ModuleField) => {
			setFields(
				fields.map((f) => {
					if (f.id === field.id) {
						return field;
					} else {
						return f;
					}
				})
			);
		},
		[fields]
	);

	// Prüfen ob DND Display nach jedem Update von Fields neu gerndert werden muss

	return (
		<div>
			<button
				className="full_button sm light"
				onClick={() => setEditFields(true)}
			>
				Felder bearbeiten
			</button>
			<SlideIn
				cancel={() => setEditFields(false)}
				confirm={() => slideInConfirmHandler()}
				isOpen={editFields}
				header={`Felder für ${moduleName || "Modul"} bearbeiten`}
				loading={loading}
				disabled={[loading, loading]}
			>
				<div>
					<DnDDisplay<ModuleField[]>
						items={
							(sortItemsByPosition(fields) as ModuleField[]) || []
						}
						ItemComponent={({ item }) => (
							<AppModuleField
								key={item.id}
								field={item as ModuleField}
								changeField={changeField}
								modulePath={modulePath}
							/>
						)}
						onChange={(newFields) => {
							setFields(
								newFields.map((field, index) => ({
									...field,
									position: index + 1
								}))
							);
						}}
						subField={{ id: moduleId, field: "fields" }}
					/>
				</div>
			</SlideIn>
		</div>
	);
};

export default AppModuleEditFields;
