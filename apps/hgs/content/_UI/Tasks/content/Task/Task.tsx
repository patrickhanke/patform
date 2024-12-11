'use client';

import clsx from 'clsx';
import React, { useCallback, useState } from 'react';
import styles from './Task.module.scss';
import TeamAssignment from './content/TeamAssignment';
import DisplayTaskState from './content/DisplayTaskState';

import TaskTitle from './components/TaskTitle';
import TaskNextDate from './content/TaskNextDate';
import { useDataHandler } from '@/provider';
import { useQuery } from '@apollo/client';
import { GET_TASK } from '@/queries';
import DisplayPropery from './content/DisplayPropery';
import TaskSlideIn from './content/TaskSlideIn';
import { TaskComponent } from '@/types';
import { Divider, IconButton, Modal } from '@repo/ui';

const Task = ({task, deleteTask, showDivider, tasksRefetch} : TaskComponent) => {
	const {data, refetch} = useQuery(GET_TASK, {variables: {id: task.objectId}});
	const {updateData} = useDataHandler();
	const [deleteTaskModal, setDeleteTaskModal] = useState(false);
	const [archiveModal, setArchiveModal] = useState(false);

	const archiveTaskHandler = useCallback(async () => {
		await updateData({
			className: 'Task',
			objectId: task.objectId,
			updateObject: {
				state: 'archived'
			}
		});
		tasksRefetch();
	}, [task.objectId]);

	return (
		<>
			{showDivider && <Divider date={task.dates[0] || null} size='large' type='block' />}
			<div className={clsx(styles.task_container)}>
				<div className={styles.task_main_container} >
					<div className={styles.task_title} >
						{!(task.state === 'completed' || task.state === 'archived')  ?
							<TaskTitle
								taskId={task.objectId}
								taskTitle={data?.objects.getTask.title || task.title}
								refetch={refetch}
							/>
							:
							<p>{task.title}</p>
						}
					</div>
					<div className='vertical_line use_height' />

					<div className={styles.task_date}>
						{!(task.state === 'completed' || task.state === 'archived') &&
							<>
								<TaskNextDate taskId={task.objectId} tasksRefetch={tasksRefetch} />
							</>
						}
						{task.state === 'completed' &&
							<div style={{marginLeft: '24px'}}>
								<IconButton icon='archive' onClick={() => setArchiveModal(true)} text='Aufgabe archivieren' />
							</div>
						}
					</div>
					<div className='vertical_line use_height' />
					<div className={styles.task_property}>
						<DisplayPropery taskId={task.objectId} />
					</div>
					<div className='vertical_line use_height' />
					<div className={styles.task_state}>
						<DisplayTaskState taskId={task.objectId} taskState={data?.objects?.getTask?.state} />
					</div>
					<div className='vertical_line use_height' />
					<div className={styles.task_team}>
						{data &&
							<TeamAssignment
								taskId={task.objectId}
								refetchTask={refetch}
								taskState={data.objects.getTask.state}
								showAsButton
								selectWorkers={data.objects.getTask.state === 'created' || data.objects.getTask.state === 'assigned'}
							/>
						}
					</div>
					<div className='vertical_line use_height' />
					<TaskSlideIn title={task.title} taskId={task.objectId} />
				</div>
				<Modal 
					isOpen={deleteTaskModal}
					header='Aufgabe löschen'
					confirmButtonHandler={() => deleteTask(task.objectId)}
					cancelButtonHandler={() => setDeleteTaskModal(false)}
				>
					<p>
						Sie Sie sicher, dass sie die Aufgabe <span style={{fontWeight: 600}}>{task.title}</span> löschen möchten? Dieser Vorgang lässt sich nicht rückgängig machen.
					</p>
				</Modal>
				<Modal 
					isOpen={archiveModal}
					header='Aufgabe löschen'
					confirmButtonHandler={() => archiveTaskHandler()}
					cancelButtonHandler={() => setArchiveModal(false)}
				>
					<p>
						Sie Sie sicher, dass sie die Aufgabe <span style={{fontWeight: 600}}>{task.title}</span> archivieren möchten? 
					</p>
				</Modal>
			</div>
		</>
	);
};

export default Task;