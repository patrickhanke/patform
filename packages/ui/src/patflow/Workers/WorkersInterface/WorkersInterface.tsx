"use client";

import { useDataStore } from "@repo/provider";
import styles from "./WorkersInterface.module.scss";
import DisplayWorkerInterface from "./components/DisplayWorkerInterface";
import { WorkersInterfaceComponent } from "./types";
import { Worker } from "@repo/types";

const WorkersInterface = ({
	workers,
	onChange,
	nextDate
}: WorkersInterfaceComponent) => {
	const { workers: workerData } = useDataStore();

	return (
		<div className={styles.worker_interface_container}>
			{workerData.map((worker: Worker) => (
				<DisplayWorkerInterface
					key={worker.objectId}
					worker={worker}
					isSelected={workers.includes(worker.objectId)}
					onChange={onChange}
					nextDate={nextDate}
				/>
			))}
		</div>
	);
};

export default WorkersInterface;
