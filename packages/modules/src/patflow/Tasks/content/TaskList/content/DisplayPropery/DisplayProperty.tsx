import { useDataHandler, useDataStore } from "@repo/provider";
import { Modal, StateDisplay } from "@repo/ui";
import "./styles.scss";
import TaskSelectPropery from "./components/TaskSelectProperty";
import { useState } from "react";
import { Property } from "@repo/types";

const DisplayProperty = ({
	taskId,
	taskProperty,
	isEditable = true
}: {
	taskId: string;
	taskProperty: Property;
	isEditable?: boolean;
}) => {
	const { updateData } = useDataHandler();
	const [selectProperty, setSelectProperty] = useState(false);
	const [loading, setLoading] = useState(false);
	const { properties } = useDataStore();
	const property = properties.find(
		(property) => property.objectId === taskProperty.objectId
	);
	const [selectedProperty, setSelectedProperty] = useState<string>(
		property?.objectId || ""
	);

	return (
		<>
			<div
				className="task_property_object_container"
				onClick={() => {
					if (!isEditable) return;
					setSelectProperty(true);
				}}
			>
				<StateDisplay
					// type="label"
					color="light"
					label={property?.name || "Kein Objekt zugewiesen"}
					icon="house"
					// noBackground
				/>
			</div>

			<Modal
				cancelButtonHandler={() => {
					setSelectedProperty("");
					setSelectProperty(false);
				}}
				confirmButtonHandler={async () => {
					setLoading(true);
					await updateData({
						className: "Task",
						objectId: taskId,
						updateObject: {
							property: {
								__type: "Pointer",
								className: "Property",
								objectId: selectedProperty
							}
						},
						feedback: "Objekt erfolgreich zugewiesen"
					});
					setLoading(false);
					setSelectProperty(false);
				}}
				isOpen={selectProperty}
				header="Objekt auswählen"
				buttonDisabled={[loading, loading]}
			>
				<TaskSelectPropery
					selectedProperty={selectedProperty}
					setSelectedProperty={setSelectedProperty}
				/>
			</Modal>
		</>
	);
};

export default DisplayProperty;
