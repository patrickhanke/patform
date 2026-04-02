import { FC, useState, useMemo } from "react";
import TaskDescription from "../TaskDescription";
import TaskComments from "../TaskComments";
import styles from "./TaskSlideIn.module.scss";
import { getDateString, useDataHandler, useGetData } from "@repo/provider";
import TaskDocuments from "../TaskDocuments";
import TaskImages from "../TaskImages";
import DisplayTaskState from "../DisplayTaskState";
import DisplayPropery from "../DisplayPropery";
import TeamAssignment from "../TeamAssignment";
import {
	IconButton,
	Modal,
	SlideIn,
	StateDisplay,
	SwitchButtons
} from "@repo/ui";
import { TaskSlideInProps } from "./types";
import TaskSlideInTicketDetails from "./components/TaskSlideInTicketDetails";
import { TaskDate } from "../TaskDate";

const TaskSlideIn: FC<TaskSlideInProps> = ({
	task,
	isEditable = true,
	refetchTasks
}) => {
	const { title } = task;
	const taskId = task.objectId;
	const { deleteData } = useDataHandler();
	const [deleteTask, setDeleteTask] = useState(false);
	const [showDetails, setShowDetails] = useState(false);

	const { data: ticketData } = useGetData({
		objectName: "Ticket",
		fields: [
			"objectId",
			"title",
			"description",
			"images",
			"created_by { objectId username }"
		],
		id: taskId,
		skip: !task || !task.ticket
	});

	const { data: dataDocuments, refetch: refetchDocuments } = useGetData({
		objectName: "Document",
		fields: ["objectId", "name", "created_by { objectId username }"],
		id: taskId
	});

	const buttonStates = useMemo(() => {
		const buttonStates = [
			{
				value: "comments",
				label: "Kommentare",
				disabled: false
			},
			{
				value: "images",
				label: "Bilder",
				disabled: false
			},
			{
				value: "documents",
				label: "Dokumente",
				disabled: false
			},
			{
				value: "ticket",
				label: "Ticket",
				disabled: !ticketData
			}
		] as const;
		return buttonStates;
	}, [task, ticketData]);

	const [buttonState, setButtonState] = useState<
		(typeof buttonStates)[number]
	>(buttonStates[0]);

	const secondaryContent = useMemo(() => {
		return (
			<div className={styles.task_slidein_bottom_content}>
				<div className={styles.task_slidein_bottom_buttons}>
					<SwitchButtons
						buttonStates={[...buttonStates]}
						currentStates={buttonState}
						changeHandler={setButtonState}
					/>
				</div>
				{buttonState.value === "documents" && dataDocuments && (
					<TaskDocuments
						taskId={taskId}
						documents={dataDocuments.objects.findDocument.results}
						refetch={refetchDocuments}
						isEditable={isEditable}
					/>
				)}
				{buttonState.value === "images" && task && (
					<TaskImages
						taskId={taskId}
						images={task?.images}
						refetch={refetchTasks}
						isEditable={isEditable}
					/>
				)}
				{buttonState.value === "comments" && task && (
					<TaskComments
						taskId={taskId}
						comments={task?.comments}
						refetch={refetchTasks}
						isEditable={isEditable}
					/>
				)}
				{buttonState.value === "ticket" && task && (
					<TaskSlideInTicketDetails ticket={ticketData} />
				)}
			</div>
		);
	}, [buttonStates, buttonState, task, dataDocuments]);

	if (!task) {
		return null;
	}

	return (
		<>
			<div className="button_container">
				<div className={styles.task_slidein_content}></div>
				<IconButton
					icon="comments"
					text={task ? task.comments.length.toString() : "0"}
					onClick={() => {
						setShowDetails(true);
						setButtonState(buttonStates[0]);
					}}
				/>
				<IconButton
					icon="images"
					text={task ? task.images.length.toString() : "0"}
					onClick={() => {
						setShowDetails(true);
						setButtonState(buttonStates[1]);
					}}
				/>
				<IconButton
					icon="documents"
					text={
						dataDocuments
							? dataDocuments.objects.findDocument.results.length.toString()
							: "0"
					}
					onClick={() => {
						setShowDetails(true);
						setButtonState(buttonStates[2]);
					}}
				/>
				<IconButton
					icon="tickets"
					disabled={!task?.ticket}
					text=" "
					onClick={() => {
						setShowDetails(true);
						setButtonState(buttonStates[0]);
					}}
				/>
			</div>
			<SlideIn
				isOpen={showDetails}
				cancel={() => setShowDetails(false)}
				showCancelButton={false}
				header={title}
				size="small"
				confirmText="Schließen"
				confirm={() => setShowDetails(false)}
				preventClickOutside
				secondaryContent={secondaryContent}
				showSecondaryContent={true}
			>
				<div className={styles.task_slidein_content}>
					<div className={"flex col a-st gap-md"}>
						<div className={styles.task_slidein_content_element}>
							<label
								className={
									styles.task_slidein_content_element_label
								}
							>
								Status
							</label>
							<div>
								<DisplayTaskState taskState={task?.state} />
							</div>
						</div>
						<div className={styles.task_slidein_content_element}>
							<label
								className={
									styles.task_slidein_content_element_label
								}
							>
								Datum
							</label>
							<div>
								<TaskDate taskId={task.objectId} />
							</div>
						</div>
						<div className={styles.task_slidein_content_element}>
							<label
								className={
									styles.task_slidein_content_element_label
								}
							>
								Abgeschlossen
							</label>
							<div>
								{task.executed_at
									? `${getDateString(task.executed_at).date} - ${getDateString(task.executed_at).time}`
									: "-"}
							</div>
						</div>
						<div className={styles.task_slidein_content_element}>
							<label
								className={
									styles.task_slidein_content_element_label
								}
							>
								Objekt
							</label>
							<div>
								<DisplayPropery
									taskId={taskId}
									taskProperty={task.property}
									isEditable={isEditable}
									refetchTasks={refetchTasks}
								/>
							</div>
						</div>
						<div className={styles.task_slidein_content_element}>
							<label
								className={
									styles.task_slidein_content_element_label
								}
							>
								Zugeteilt
							</label>
							<div>
								<TeamAssignment
									task={task}
									refetch={refetchTasks}
								/>
							</div>
						</div>
						<div
							className={styles.task_slidein_content_element}
							data-flexstart="true"
						>
							<label
								className={
									styles.task_slidein_content_element_label
								}
							>
								Beschreibung
							</label>
							<TaskDescription
								taskId={taskId}
								isEditable={isEditable}
							/>
						</div>
						<div
							className={styles.task_slidein_content_element}
							data-flexstart="true"
						>
							<label
								className={
									styles.task_slidein_content_element_label
								}
							>
								Ticket
							</label>
							<div>
								{task && task.ticket ? (
									<StateDisplay
										color="light"
										label={task.ticket.title}
										icon="ticket"
									/>
								) : (
									<p>Kein Ticket verknüpft</p>
								)}
							</div>
						</div>
						<div>
							<button
								className={"full_button red md"}
								onClick={() => setDeleteTask(true)}
							>
								Aufgabe löschen
							</button>
						</div>
					</div>
				</div>
			</SlideIn>
			<Modal
				isOpen={deleteTask}
				header="Aufgabe löschen"
				confirmButtonHandler={async () => {
					await deleteData({
						className: "Task",
						objectId: taskId,
						feedback: "Aufgabe erfolgreich gelöscht"
					});
					await refetchTasks();
					setDeleteTask(false);
					setShowDetails(false);
				}}
				cancelButtonHandler={() => setDeleteTask(false)}
			>
				<p>
					Sie Sie sicher, dass sie die Aufgabe{" "}
					<span style={{ fontWeight: 600 }}>{task?.title}</span>{" "}
					löschen möchten? Dieser Vorgang lässt sich nicht rückgängig
					machen.
				</p>
			</Modal>
		</>
	);
};

export default TaskSlideIn;
