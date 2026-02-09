import { DisplayWorker } from "@repo/ui";
import { useDataHandler, useGetData, useFindData } from "@repo/provider";
import { DisplayWorkersProps, Worker } from "@repo/types";
import { FC, useMemo, useState } from "react";

import styles from "../TeamAssignment.module.scss";
import { ElementSelectInterface, SlideInRight } from "@repo/ui";
import { WorkerOption } from "../types";

const DisplayWorkers: FC<DisplayWorkersProps> = ({
	propertyId,
	showAsButton = false
}) => {
	const [isOpen, setIsOpen] = useState(false);
	const { updateData } = useDataHandler();
	const { data: property, refetch } = useGetData({
		objectName: "Property",
		fields: ["assigned_staff"],
		id: propertyId
	});
	const { data: workerData } = useFindData({
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
		filters: [{ key: "is_worker", value: true, operator: "equalTo" }],
		order: "last_name_DESC"
	});

	const elements = useMemo(() => {
		const workerOptionsArray: WorkerOption[] = [];
		if (workerData) {
			workerData.forEach((worker: Worker) => {
				if (worker) {
					workerOptionsArray.push({
						value: worker.objectId,
						id: worker.objectId,
						label: `${worker.first_name} ${worker.last_name}`,
						element: <DisplayWorker workerId={worker.objectId} />
					});
				}
			});
		}
		workerOptionsArray.sort((a, b) => a.label?.localeCompare(b.label));

		return workerOptionsArray;
	}, [workerData]);

	const workerComponent = useMemo(
		() => (
			<ElementSelectInterface
				elements={elements}
				selectedElements={
					property
						? property.assigned_staff.map((element: string) =>
								elements.find((el) => el.value === element)
							)
						: []
				}
				onSelect={async (values) => {
					const workers = values.map((value) => value.value);
					await updateData({
						className: "Property",
						objectId: propertyId,
						updateObject: {
							assigned_staff: [...workers]
						}
					});
					refetch();
				}}
				max={100}
				isSearchable
			/>
		),
		[property, property?.assigned_staff?.length]
	);

	const staffNumber = property?.assigned_staff?.length || 0;

	if (property)
		return !showAsButton ? (
			<>
				{property.assigned_staff.map((workerId: Worker["objectId"]) => (
					<DisplayWorker
						key={workerId}
						workerId={workerId}
						onlyImage={false}
					/>
				))}
				<SlideInRight
					isOpen={isOpen}
					setIsOpen={setIsOpen}
					header="Arbeiter auswählen"
				>
					{workerComponent}
				</SlideInRight>
			</>
		) : (
			<>
				<button
					className={"full_button sm light"}
					onClick={() => setIsOpen(true)}
				>
					{/* <IoPersonCircleOutline size={24} color={'#efefef'} /> */}
					<div className={styles.button_workers_container}>
						{staffNumber > 0 ? (
							property.assigned_staff.map(
								(
									workerId: Worker["objectId"],
									index: number
								) => (
									<div
										key={workerId}
										style={{
											width: "fit-content",
											transform: `translateX(${-index * 12}px)`,
											overflow: "visible",
											zIndex: index
										}}
									>
										<DisplayWorker
											workerId={workerId}
											onlyImage={true}
										/>
									</div>
								)
							)
						) : (
							<span>+ Arbeiter hinzufügen</span>
						)}
					</div>
				</button>
				<SlideInRight
					isOpen={isOpen}
					setIsOpen={setIsOpen}
					header="Arbeiter auswählen"
				>
					{workerComponent}
				</SlideInRight>
			</>
		);
	return null;
};

export default DisplayWorkers;
