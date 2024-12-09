import SlideIn from '@/_UI/surfaces/SlideIn';
import React, { useMemo, useState } from 'react';
import { StateDisplay, SwitchButtons } from '@/_UI';
import TaskDescription from '../TaskDescription';
import TaskComments from '../TaskComments';
import IconButton from '@/_UI/interfaces/IconButton';
import styles from './TaskSlideIn.module.scss';
import { useQuery } from '@apollo/client';
import { FIND_DOCUMENTS_FOR_TASK, GET_TASK_SLIDEIN_CONTENT } from '@/queries';
import TaskDocuments from '../TaskDocuments';
import TaskImages from '../TaskImages';
import DisplayTaskState from '../DisplayTaskState';
import TaskNextDate from '../TaskNextDate';
import DisplayPropery from '../DisplayPropery';
import TeamAssignment from '../TeamAssignment';
import { findTicketRoute } from '@/provider';
import { useRouter } from 'next/navigation';

const TaskSlideIn = ({title, taskId}: {title: string, taskId: string}) => {
	const [showDetails, setShowDetails] = useState(false);
	const router = useRouter();
	const {data: dataSlidein, refetch: refetchSlideIn} = useQuery(GET_TASK_SLIDEIN_CONTENT, {
		variables: {id: taskId},
		notifyOnNetworkStatusChange: true
	});

	const {data: dataDocuments, refetch: refetchDocuments} = useQuery(FIND_DOCUMENTS_FOR_TASK, {
		variables: {id: taskId},
		notifyOnNetworkStatusChange: true
	});

	const buttonStates = useMemo(() => {
		const buttons: {value: string, label: string, disabled?: boolean}[] = [
			{
				value: 'comments',
				label: 'Kommentare'
			},
			{
				value: 'images',
				label: 'Bilder'
			},
			{
				value: 'documents',
				label: 'Dokumente'
			}
		];

		return buttons;
	}, [dataSlidein]);	

	const [buttonState, setButtonState] = useState(buttonStates[0]);


	return (
		<>
			<div className='button_container'>
				<div className={styles.task_slidein_content}>

				</div>
				<IconButton 
					icon='comments' 
					text={dataSlidein ? dataSlidein.objects.getTask.comments.length.toString() : '0'} 
					onClick={() => {
						setShowDetails(true);
						setButtonState(buttonStates[0]);
					}}
				/>
				<IconButton 
					icon='images' 
					text={dataSlidein ? dataSlidein.objects.getTask.images.length.toString() : '0'} 
					onClick={() => {
						setShowDetails(true);
						setButtonState(buttonStates[1]);
					}} 
				/>
				<IconButton 
					icon='documents' 
					text={dataDocuments ? dataDocuments.objects.findDocument.results.length.toString() : '0'} 
					onClick={() => {
						setShowDetails(true);
						setButtonState(buttonStates[2]);
					}}
				/>
				<IconButton 
					icon='tickets' 
					disabled={!dataSlidein?.objects.getTask.ticket}
					text=' '
					onClick={() => {
						setShowDetails(true);
						setButtonState(buttonStates[0]);
					}} 
				/>
			</div>
			<SlideIn
				isOpen={showDetails}
				setIsOpen={setShowDetails}
				header={title}
				size='small'
			>
				<div className={styles.task_slidein_content}>
					<div className={styles.task_slidein_top_content}>
						<div className={styles.task_slidein_content_element}>
							<label className={styles.task_slidein_content_element_label}>
								Status
							</label>
							<div>
								<DisplayTaskState taskId={taskId} taskState={dataSlidein?.objects?.getTask?.state} />
							</div>
						</div>
						<div className={styles.task_slidein_content_element}>
							<label className={styles.task_slidein_content_element_label}>
								Datum
							</label>
							<div>
								<TaskNextDate taskId={taskId} />
							</div>
						</div>
						<div className={styles.task_slidein_content_element}>
							<label className={styles.task_slidein_content_element_label}>
								Objekt
							</label>
							<div>
								<DisplayPropery taskId={taskId} />
							</div>
						</div>
						<div className={styles.task_slidein_content_element}>
							<label className={styles.task_slidein_content_element_label}>
								Zugeteilt
							</label>
							<div>
								<TeamAssignment taskId={taskId} refetchTask={refetchSlideIn} />
							</div>
						</div>
						<div className={styles.task_slidein_content_element} data-flexstart='true'>
							<label className={styles.task_slidein_content_element_label}>
								Beschreibung
							</label>
							<TaskDescription taskId={taskId} />
						</div>
						<div className={styles.task_slidein_content_element} data-flexstart='true'>
							<label className={styles.task_slidein_content_element_label}>
								Ticket
							</label>
							<div>
								{dataSlidein && dataSlidein.objects.getTask.ticket ? (
									<StateDisplay<'no-state'>
										type='Ticket'
										color='light'
										label={dataSlidein.objects.getTask.ticket.title}
										icon='ticket'
										onClick={() => router.push(`${findTicketRoute(dataSlidein.objects.getTask.ticket.state)}?ticket=${dataSlidein.objects.getTask.ticket.objectId}`)}
									/>
								) : (
									<p>Kein Ticket verknüpft</p>
								)}
							</div>
						</div>
					</div>
					<div className={styles.task_slidein_bottom_content}>
						<div style={{marginBottom: 18}}> 
							<SwitchButtons
								buttonStates={buttonStates}
								currentStates={buttonState}
								changeHandler={setButtonState}
								underlineButtons
							/>
						</div>
						{buttonState.value === 'documents' && dataDocuments && <TaskDocuments taskId={taskId} documents={dataDocuments.objects.findDocument.results} refetch={refetchDocuments} />}
						{buttonState.value === 'images' && dataSlidein && (
							<TaskImages
								taskId={taskId}
								taskName={title}
								images={dataSlidein.objects.getTask.images}
								refetch={refetchSlideIn}
							/>
						)}
						{buttonState.value === 'comments' && dataSlidein && <TaskComments taskId={taskId} comments={dataSlidein.objects.getTask.comments} refetch={refetchSlideIn} />}
					</div>
				</div>
			</SlideIn>
		</>
	);
};

export default TaskSlideIn;