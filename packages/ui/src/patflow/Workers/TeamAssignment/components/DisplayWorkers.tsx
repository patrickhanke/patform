"use client";

import { FC, useMemo, useState } from "react";
import { DisplayWorker } from "@repo/ui";
import { FIND_ALL_STAFF } from "@repo/provider";
import { useQuery } from "@apollo/client";

import styles from "../TeamAssignment.module.scss";
import { ElementSelectInterface, SlideInRight } from "@repo/ui";
import { DisplayWorkersProps, WorkerOption } from "../types";
import { Worker } from "@repo/types";

const DisplayWorkers: FC<DisplayWorkersProps> = ({
	workers,
	onChange,
	showAsButton = false
}) => {
	const [isOpen, setIsOpen] = useState(false);

	const { data: workerData } = useQuery(FIND_ALL_STAFF);

	const elements = useMemo(() => {
		const workerOptionsArray: WorkerOption[] = [];
		if (workerData) {
			workerData.objects.find_User.results.forEach((worker: Worker) => {
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

	const selectedElements = useMemo(() => {
		const elementsArray: WorkerOption[] = [];
		workers.forEach((workerId: Worker["objectId"]) => {
			const worker = elements.find(
				(element) => element.value === workerId
			);
			if (worker) {
				elementsArray.push(worker);
			}
		});

		return elementsArray;
	}, []);

	const workerComponent = useMemo(
		() => (
			<ElementSelectInterface
				elements={elements}
				selectedElements={selectedElements}
				onSelect={async (values: WorkerOption[]) => onChange(values)}
				max={100}
				isSearchable
			/>
		),
		[workers]
	);

	const staffNumber = workers.length || 0;

	return !showAsButton ? (
		<>
			{workers.map((workerId: Worker["objectId"]) => (
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
						workers.map(
							(workerId: Worker["objectId"], index: number) => (
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
