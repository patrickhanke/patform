import React, { FC, useState, useMemo } from "react";
import TaskDescription from "../TaskDescription";
import TaskComments from "../TaskComments";
import styles from "./TaskSlideIn.module.scss";
import { useQuery } from "@apollo/client";
import {
	FIND_DOCUMENTS_FOR_TASK,
	GET_TASK_SLIDEIN_CONTENT,
	getDateString
} from "@repo/provider";
import TaskDocuments from "../TaskDocuments";
import TaskImages from "../TaskImages";
import DisplayTaskState from "../DisplayTaskState";
import TaskNextDate from "../TaskNextDate";
import DisplayPropery from "../DisplayPropery";
import TeamAssignment from "../TeamAssignment";
import { IconButton, SlideIn, StateDisplay, SwitchButtons } from "@repo/ui";
import { TaskSlideInProps } from "./types";
import TaskSlideInTicketDetails from "./components/TaskSlideInTicketDetails";
import { TaskDate } from "../TaskDate";

const TaskSlideIn: FC<TaskSlideInProps> = ({ title, taskId }) => {
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
					/>
				)}
				{buttonState.value === "images" && dataSlidein && (
					<TaskImages
						taskId={taskId}
						taskName={title}
						images={dataSlidein.objects.getTask.images}
						refetch={refetchSlideIn}
					/>
				)}
				{buttonState.value === "comments" && dataSlidein && (
					<TaskComments
						taskId={taskId}
						comments={dataSlidein.objects.getTask.comments}
						refetch={refetchSlideIn}
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
					<div className={"flex col al-st gap-md"}>
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
								<DisplayPropery taskId={taskId} />
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
							<TaskDescription taskId={taskId} />
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
					</div>
				</div>
			</SlideIn>
		</>
	);
};

export default TaskSlideIn;
