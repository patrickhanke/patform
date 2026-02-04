import { useFindData, useGetData } from "@repo/provider";
import { ElementSelectInterface, SelectElement, StateDisplay } from "@repo/ui";
import { Task, Worker } from "@repo/types";
import { FC, useMemo } from "react";
import { PropertyOptions, SelectWorkerProps } from "../types";
import { DisplayWorker } from "@repo/ui";

const SelectWorker: FC<SelectWorkerProps> = ({ setTask, task }) => {
	const { data: workerData } = useFindData({
		objectName: "User",
		fields: ["objectId", "first_name", "last_name"],
		filters: [
			{
				key: "is_worker",
				value: true,
				operator: "equalTo",
				id: "is_worker"
			}
		]
	});

	console.log(workerData);
	const { data: propertyData } = useGetData({
		objectName: "Property",
		fields: ["assigned_staff", "objectId", "name"],
		id: task.property,
		skip: !task.property
	});

	const elements = useMemo(() => {
		const workerOptionsArray: PropertyOptions[] = [];
		const propertyStaff = propertyData?.assigned_staff || [];

		if (workerData) {
			workerData.forEach((worker: Worker) => {
				if (worker) {
					workerOptionsArray.push({
						value: worker.objectId,
						id: worker.objectId,
						label: `${worker.first_name} ${worker.last_name}`,
						element: (
							<div className={"worker_display_container"}>
								<DisplayWorker workerId={worker.objectId} />
								{propertyData &&
									propertyStaff.includes(worker.objectId) && (
										<StateDisplay
											label={propertyData?.name}
											color="green"
										/>
									)}
							</div>
						)
					});
				}
			});
		}
		workerOptionsArray.sort((a, b) => a.label?.localeCompare(b.label));

		return workerOptionsArray;
	}, [workerData, propertyData]);

	return (
		<ElementSelectInterface
			title="Arbeiter auswählen"
			elements={elements}
			selectedElements={
				task.assigned_staff.map((element) =>
					elements.find((el) => el.value === element)
				) as SelectElement[]
			}
			onSelect={(values) => {
				if (values.length > 0) {
					setTask((task: Task) => ({
						...task,
						assigned_staff: values.map((value) => value.value)
					}));
				} else if (values.length === 0) {
					setTask((task: Task) => ({
						...task,
						assigned_staff: []
					}));
				}
			}}
			max={100}
			isSearchable
		/>
	);
};

export default SelectWorker;
