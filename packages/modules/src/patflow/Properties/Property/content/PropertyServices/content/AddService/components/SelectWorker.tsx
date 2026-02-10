import { useFindDataSecure, useGetData } from "@repo/provider";
import { ElementSelectInterface, SelectElement, StateDisplay } from "@repo/ui";
import { CreateService, Worker } from "@repo/types";
import { FC, useMemo } from "react";
import { SelectWorkerProps } from "../types";
import { DisplayWorker } from "@repo/ui";

const SelectWorker: FC<SelectWorkerProps> = ({
	setService,
	service,
	propertyId
}) => {
	const { data: workerData } = useFindDataSecure({
		objectName: "User",
		fields: [
			"objectId",
			"first_name",
			"last_name",
			"is_worker",
			"portrait",
			"color",
			"time_settings",
			"number",
			"data",
			"role { objectId name type color }"
		],
		filters: [
			{
				key: "is_worker",
				value: true,
				operator: "equalTo",
				id: "is_worker"
			}
		],
		order: "last_name_DESC",
		useMasterKey: true
	});
	const { data: propertyData } = useGetData({
		objectName: "Property",
		fields: ["assigned_staff", "objectId", "name"],
		id: propertyId
	});

	const elements: SelectElement[] = useMemo(() => {
		const workerOptionsArray: SelectElement[] = [];
		const propertyStaff = propertyData?.assigned_staff || [];

		if (workerData) {
			workerData.forEach((worker: Worker) => {
				if (worker) {
					workerOptionsArray.push({
						value: worker.objectId,
						id: worker.objectId,
						label: `${worker.first_name} ${worker.last_name}`,
						element: (
							<div className={"flex row a-ce gap-xs w-100"}>
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

		return workerOptionsArray || [];
	}, [workerData, propertyData]);

	return (
		<ElementSelectInterface
			title="Arbeiter auswählen"
			elements={elements}
			selectedElements={elements.filter((element) =>
				service.assigned_staff.includes(element.value as string)
			)}
			onSelect={(values) => {
				if (values.length > 0) {
					setService((draft: CreateService) => ({
						...draft,
						assigned_staff: values.map(
							(value) => value.value
						) as string[]
					}));
				} else if (values.length === 0) {
					setService((service: CreateService) => ({
						...service,
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
