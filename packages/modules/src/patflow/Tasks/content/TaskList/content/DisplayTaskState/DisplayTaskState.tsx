"use client";
import { TaskState } from "@repo/types";
import { Modal, StateDisplay, StateSelect } from "@repo/ui";
import { task_state_options, useDataHandler } from "@repo/provider";
import styles from "./DisplayTaskState.module.scss";
import { useContext, useState } from "react";
import { PatflowAppContext } from "@repo/provider";

const DisplayTaskState = ({
	taskState,
	taskId
}: {
	taskState: TaskState;
	taskId?: string;
}) => {
	const { fetchTasks } = useContext(PatflowAppContext);
	const { updateData } = useDataHandler();
	const state: (typeof task_state_options)[number] = task_state_options.find(
		(state) => state.value === taskState
	) as (typeof task_state_options)[number];

	const [isModalOpen, setIsModalOpen] = useState<
		"assinged" | "executed" | "completed" | null
	>(null);

	if (state?.id === "created" || state?.id === "assigned") {
		const service_state_options = task_state_options.filter(
			(state) =>
				state.id === "assigned" ||
				state.id === "executed" ||
				state.id === "completed"
		);
		return (
			<div className={styles.task_state_container}>
				<StateSelect<typeof service_state_options>
					stateOptions={service_state_options}
					state={taskState}
					icon="info"
					type="state"
					stateSelectHandler={(state) => {
						setIsModalOpen(
							state.value as "assinged" | "executed" | "completed"
						);
					}}
				/>
				<Modal
					header="Status der Aufgabe ändern"
					isOpen={isModalOpen !== null}
					cancelButtonHandler={() => {
						setIsModalOpen(null);
					}}
					confirmButtonHandler={async () => {
						if (taskId && isModalOpen) {
							await updateData({
								className: "Task",
								objectId: taskId,
								updateObject: {
									state: isModalOpen,
									dates: []
								}
							});
							fetchTasks();
						}

						setIsModalOpen(null);
					}}
				>
					<div>
						<p>
							Sind Sie sicher, dass Sie den Status der Aufgabe in{" "}
							<strong>
								{
									task_state_options.find(
										(state) => state.value === isModalOpen
									)?.label
								}
							</strong>{" "}
							ändern möchten?
						</p>
					</div>
				</Modal>
			</div>
		);
	}

	return (
		<div className={styles.task_state_container}>
			<StateDisplay
				label={state.label}
				color={state.color}
				icon="clock"
			/>
		</div>
	);
};

export default DisplayTaskState;
