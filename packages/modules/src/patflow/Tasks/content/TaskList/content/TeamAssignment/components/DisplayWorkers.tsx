"use client";

import { DisplayWorker, SlideIn } from "@repo/ui";
import { axiosclient, useDataStore } from "@repo/provider";
import { StaffMember, Task, Worker } from "@repo/types";
import { FC, useEffect, useMemo, useState } from "react";
import { cloneDeep } from "lodash-es";

import { formatISO9075 } from "date-fns";
import { ElementSelectInterface } from "@repo/ui";
import { DisplayWorkerProps, WorkerOption } from "../types";
import "../styles.scss";
import { AvatarGroup } from "@chakra-ui/react";

const DisplayWorkers: FC<DisplayWorkerProps> = ({
	task,
	showAsButton = false,
	selectWorkers = false,
	propertyId
}) => {
	const [isOpen, setIsOpen] = useState(false);
	const { workers } = useDataStore();
	const [selectedWorkers, setSelectedWorkers] = useState<
		Worker["objectId"][]
	>(task.assigned_staff || []);

	const [loading, setLoading] = useState(false);

	const nextDate = useMemo(() => {
		let date;
		if (task.assigned_staff) {
			const datesCopy = cloneDeep(task.dates) || [];
			if (datesCopy.length > 0) {
				const timeCopy: Task["time"] = cloneDeep(task.time);
				date = timeCopy.dates?.find(
					(dateToFind: string) =>
						formatISO9075(dateToFind, {
							representation: "date"
						}) === datesCopy[0]
				);
			}
		}

		return date;
	}, [task, workers]);

	const elements = useMemo(() => {
		const workerOptionsArray: WorkerOption[] = [];
		if (workers.length > 0) {
			workers.forEach((worker: StaffMember) => {
				if (worker) {
					workerOptionsArray.push({
						value: worker.objectId,
						id: worker.objectId,
						label: `${worker.first_name} ${worker.last_name}`,
						element: (
							<DisplayWorker
								workerId={worker.objectId}
								nextDate={nextDate}
								showAvailability
								showState
								propertyId={propertyId}
							/>
						)
					});
				}
			});
		}
		workerOptionsArray.sort((a, b) => a.label?.localeCompare(b.label));

		return workerOptionsArray;
	}, [workers, propertyId]);

	const workerComponent = useMemo(
		() => (
			<ElementSelectInterface
				elements={elements}
				selectedElements={
					elements.filter((element) =>
						selectedWorkers.includes(element.value)
					) || []
				}
				onSelect={async (values) => {
					setSelectedWorkers(
						values.map((value) => value.value as string)
					);
				}}
				max={100}
				isSearchable
			/>
		),
		[task, task.assigned_staff?.length, nextDate, selectedWorkers]
	);

	useEffect(() => {
		if (isOpen) {
			setSelectedWorkers(task.assigned_staff || []);
		}
	}, [isOpen, task.assigned_staff]);

	const staffNumber = task.assigned_staff?.length || 0;

	if (task)
		return !showAsButton ? (
			<>
				<AvatarGroup>
					{task.assigned_staff.map((workerId: Worker["objectId"]) => (
						<DisplayWorker
							key={workerId}
							workerId={workerId}
							nextDate={nextDate}
							showAvailability
							onlyImage={false}
						/>
					))}
				</AvatarGroup>
				{(task.state === "created" || task.state === "assigned") && (
					<button
						className="full_button sm light"
						onClick={() => setIsOpen(true)}
					>
						+ Arbeiter ändern
					</button>
				)}
				<SlideIn
					isOpen={isOpen}
					cancel={() => setIsOpen(false)}
					confirm={async () => {
						setLoading(true);
						await axiosclient().post(
							"functions/change-task-staff",
							{
								task_id: task.objectId,
								new_staff: [...selectedWorkers]
							}
						);
						setLoading(false);
						setIsOpen(false);
					}}
					loading={loading}
					header="Arbeiter auswählen"
				>
					{workerComponent}
				</SlideIn>
			</>
		) : (
			<>
				{selectWorkers ? (
					<>
						<button
							className={"full_button sm light"}
							onClick={() => setIsOpen(true)}
						>
							{/* <IoPersonCircleOutline size={24} color={'#efefef'} /> */}
							<div className="button_workers_container">
								{staffNumber > 0 ? (
									task.assigned_staff.map(
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
													zIndex: 1
												}}
											>
												<DisplayWorker
													workerId={workerId}
													nextDate={nextDate}
													showAvailability
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
						<SlideIn
							isOpen={isOpen}
							cancel={() => setIsOpen(false)}
							confirm={async () => {
								setLoading(true);
								await axiosclient().post(
									"functions/change-task-staff",
									{
										task_id: task.objectId,
										new_staff: [...selectedWorkers]
									}
								);
								setLoading(false);
								setIsOpen(false);
							}}
							loading={loading}
							header="Arbeiter auswählen"
						>
							{workerComponent}
						</SlideIn>
					</>
				) : (
					<div className="button_workers_container">
						{task.assigned_staff.map(
							(workerId: Worker["objectId"], index: number) => (
								<div
									key={workerId}
									style={{
										width: "12px",
										overflow: "visible",
										zIndex: index
									}}
								>
									<DisplayWorker
										workerId={workerId}
										nextDate={nextDate}
										showAvailability
										onlyImage={true}
									/>
								</div>
							)
						)}
					</div>
				)}
			</>
		);
	return null;
};

export default DisplayWorkers;
