"use client";

import { FC, useMemo, useState } from "react";
import { DisplayWorker, SelectElement, SlideIn } from "@repo/ui";

import styles from "../TeamAssignment.module.scss";
import { ElementSelectInterface } from "@repo/ui";
import { DisplayWorkersProps } from "../types";
import { Worker } from "@repo/types";
import { useDataStore } from "@repo/provider";

const DisplayWorkers: FC<DisplayWorkersProps> = ({
	workers,
	onChange,
	showAsButton = false
}) => {
	const [isOpen, setIsOpen] = useState(false);
	const [selectedWorkers, setSelectedWorkers] =
		useState<Worker["objectId"][]>(workers);

	const { workers: workerData } = useDataStore();

	const workerComponent = useMemo(
		() => (
			<ElementSelectInterface
				elements={workerData}
				selectedElements={workerData.filter((worker: Worker) =>
					selectedWorkers.includes(worker.objectId)
				)}
				onSelect={(values: SelectElement[]) => {
					if (values.length > 0) {
						setSelectedWorkers(
							values.map((value) => value.value as string)
						);
					} else {
						setSelectedWorkers([]);
					}
				}}
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
			<SlideIn
				isOpen={isOpen}
				cancel={() => setIsOpen(false)}
				confirm={() => {
					onChange(selectedWorkers);
					setIsOpen(false);
				}}
				header="Arbeiter auswählen"
			>
				{workerComponent}
			</SlideIn>
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
			<SlideIn
				isOpen={isOpen}
				cancel={() => setIsOpen(false)}
				confirm={() => {
					onChange(selectedWorkers);
					setIsOpen(false);
				}}
				header="Arbeiter auswählen"
			>
				{workerComponent}
			</SlideIn>
		</>
	);
	return null;
};

export default DisplayWorkers;
