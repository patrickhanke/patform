import { FC, useState, useMemo } from "react";
import TaskDescription from "../TaskDescription";
import TaskComments from "../TaskComments";
import styles from "./TaskSlideIn.module.scss";
import { useQuery } from "@apollo/client";
import {
	FIND_DOCUMENTS_FOR_TASK,
	GET_TASK_SLIDEIN_CONTENT,
	getDateString,
	useDataHandler
} from "@repo/provider";
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
	title,
	taskId,
	isEditable = true,
	refetchTasks
}) => {
	const { deleteData } = useDataHandler();
	const [deleteTask, setDeleteTask] = useState(false);
	const [showDetails, setShowDetails] = useState(false);
	const { data: dataSlidein, refetch: refetchSlideIn } = useQuery(
		GET_TASK_SLIDEIN_CONTENT,
		{
			variables: { id: taskId },
			notifyOnNetworkStatusChange: true
		}
	);

	const { data: dataDocuments, refetch: refetchDocuments } = useQuery(
		FIND_DOCUMENTS_FOR_TASK,
		{
			variables: { id: taskId },
			notifyOnNetworkStatusChange: true
		}
	);

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
				disabled: !dataSlidein?.objects.getTask.ticket
			}
		] as const;
		return buttonStates;
	}, [dataSlidein]);

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
				{buttonState.value === "images" && dataSlidein && (
					<TaskImages
						taskId={taskId}
						taskName={title}
						images={dataSlidein.objects.getTask.images}
						refetch={refetchSlideIn}
						isEditable={isEditable}
					/>
				)}
				{buttonState.value === "comments" && dataSlidein && (
					<TaskComments
						taskId={taskId}
						comments={dataSlidein.objects.getTask.comments}
						refetch={refetchSlideIn}
						isEditable={isEditable}
					/>
				)}
				{buttonState.value === "ticket" && dataSlidein && (
					<TaskSlideInTicketDetails
						ticket={dataSlidein?.objects.getTask.ticket}
					/>
				)}
			</div>
		);
	}, [buttonStates, buttonState, dataSlidein, dataDocuments]);
	const task = dataSlidein?.objects.getTask;

	if (!task) {
		return null;
	}

	return (
		<>
			<div className="button_container">
				<div className={styles.task_slidein_content}></div>
				<IconButton
					icon="comments"
					text={
						dataSlidein
							? dataSlidein.objects.getTask.comments.length.toString()
							: "0"
					}
					onClick={() => {
						setShowDetails(true);
						setButtonState(buttonStates[0]);
					}}
				/>
				<IconButton
					icon="images"
					text={
						dataSlidein
							? dataSlidein.objects.getTask.images.length.toString()
							: "0"
					}
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
					disabled={!dataSlidein?.objects.getTask.ticket}
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
								<DisplayTaskState
									taskState={
										dataSlidein?.objects?.getTask?.state
									}
								/>
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
								<TaskDate taskId={taskId} />
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
									isEditable={isEditable}
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
									taskId={taskId}
									refetchTask={refetchSlideIn}
									taskState={
										dataSlidein?.objects.getTask.state
									}
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
								{dataSlidein &&
								dataSlidein.objects.getTask.ticket ? (
									<StateDisplay
										color="light"
										label={
											dataSlidein.objects.getTask.ticket
												.title
										}
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
