import { useDataHandler, useGetData } from "@repo/provider";
import { Loader, Modal, StateDisplay } from "@repo/ui";
import "./styles.scss";
import TaskSelectPropery from "./components/TaskSelectProperty";
import { useEffect, useState } from "react";

const DisplayProperty = ({
	taskId,
	isEditable = true
}: {
	taskId: string;
	isEditable?: boolean;
}) => {
	const { updateData } = useDataHandler();
	const [selectProperty, setSelectProperty] = useState(false);
	const [loading, setLoading] = useState(false);

	const [selectedProperty, setSelectedProperty] = useState<string>("");

	const { data, refetch } = useGetData({
		objectName: "Task",
		fields: ["objectId", "property { name objectId }"],
		id: taskId
	});

	useEffect(() => {
		if (data) {
			setSelectedProperty(data?.property?.objectId);
		}
	}, [data]);

	if (data)
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
						label={data?.name || "Kein Objekt zugewiesen"}
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
						await refetch();
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

	return <Loader width="30px" height="18px" />;
};

export default DisplayProperty;
