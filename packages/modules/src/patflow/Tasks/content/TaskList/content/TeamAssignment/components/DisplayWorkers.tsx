import { DisplayWorker } from "@repo/ui";
import { axiosclient, useDataStore, useGetData } from "@repo/provider";
import { StaffMember, Task, Worker } from "@repo/types";
import { FC, useEffect, useMemo, useState } from "react";
import { cloneDeep } from "lodash-es";

import { formatISO9075 } from "date-fns";
import { ElementSelectInterface, SlideInRight } from "@repo/ui";
import { DisplayWorkerProps, WorkerOption } from "../types";
import "../styles.scss";
import { AvatarGroup } from "@chakra-ui/react";

const DisplayWorkers: FC<DisplayWorkerProps> = ({
	taskId,
	taskState,
	refetchTask,
	showAsButton = false,
	selectWorkers = false
}) => {
	const [isOpen, setIsOpen] = useState(false);
	const { data: taskData, refetch } = useGetData({
		objectName: "Task",
		fields: ["objectId", "assigned_staff", "dates", "time", "title"],
		id: taskId
	});
	const { workers } = useDataStore();

	const nextDate = useMemo(() => {
		let date;
		if (taskData) {
			const datesCopy = cloneDeep(taskData.dates) || [];
			if (datesCopy.length > 0) {
				const timeCopy: Task["time"] = cloneDeep(taskData.time);
				date = timeCopy.dates?.find(
					(dateToFind: string) =>
						formatISO9075(dateToFind, {
							representation: "date"
						}) === datesCopy[0]
				);
			}
		}

		return date;
	}, [taskData, workers]);

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
							/>
						)
					});
				}
			});
		}
		workerOptionsArray.sort((a, b) => a.label?.localeCompare(b.label));

		return workerOptionsArray;
	}, [workers]);

	const workerComponent = useMemo(
		() => (
			<ElementSelectInterface
				elements={elements}
				selectedElements={
					taskData
						? taskData.assigned_staff.map((element: string) =>
								elements.find((el) => el.value === element)
							)
						: []
				}
				onSelect={async (values) => {
					const newWorkers = values.map((value) => value.value);
					await axiosclient().post("functions/change-task-staff", {
						task_id: taskId,
						new_staff: [...newWorkers]
					});
					refetch();
				}}
				max={100}
				isSearchable
			/>
		),
		[taskData, taskData?.assigned_staff?.length, nextDate]
	);

	useEffect(() => {
		if (!isOpen) {
			refetchTask();
		}
	}, [isOpen, refetchTask]);

	const staffNumber = taskData?.assigned_staff.length || 0;

	if (taskData)
		return !showAsButton ? (
			<>
				<AvatarGroup>
					{taskData.assigned_staff.map(
						(workerId: Worker["objectId"]) => (
							<DisplayWorker
								key={workerId}
								workerId={workerId}
								nextDate={nextDate}
								showAvailability
								onlyImage={false}
							/>
						)
					)}
				</AvatarGroup>
				{(taskState === "created" || taskState === "assigned") && (
					<button
						className="full_button sm light"
						onClick={() => setIsOpen(true)}
					>
						+ Arbeiter ändern
					</button>
				)}
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
				{selectWorkers ? (
					<>
						<button
							className={"full_button sm light"}
							onClick={() => setIsOpen(true)}
						>
							{/* <IoPersonCircleOutline size={24} color={'#efefef'} /> */}
							<div className="button_workers_container">
								{staffNumber > 0 ? (
									taskData.assigned_staff.map(
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
						<SlideInRight
							isOpen={isOpen}
							setIsOpen={setIsOpen}
							header="Arbeiter auswählen"
						>
							{workerComponent}
						</SlideInRight>
					</>
				) : (
					<div className="button_workers_container">
						{taskData.assigned_staff.map(
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
