import { useDataHandler } from '@provider';
import React, { useCallback, useState } from 'react';
import styles from '../Task.module.scss';
import { IconButton, TextInput } from '@repo/ui';

const TaskTitle = ({ taskId, taskTitle, refetch}: {taskId: string, taskTitle: string, refetch: () => void}) => {
	const [title, setTitle] = useState(taskTitle || '');
	const {updateData} = useDataHandler();
	const [titleEdit, setTitleEdit] = useState(false);

	const titleDataHandler = useCallback( async () => {
		await updateData({
			className: 'Task',
			objectId: taskId,
			updateObject: {
				title
			}
		});
		refetch();
		setTitleEdit(false);
	}, [title] );

	return titleEdit ?
		<div className={styles.task_title_container}>
			<TextInput
				id='task_title'
				label=''
				defaultValue={taskTitle}
				onChange={value => setTitle(value)}
				
			/>
			<div className='button_container'>
				<IconButton icon='cancel' onClick={() => setTitleEdit(false)} noBorder />
				<IconButton icon='check' onClick={() => titleDataHandler()} noBorder />
			</div>
		</div>
		:
		<div className={styles.task_title_container}>
			<div style={{flex: '1', display: 'inline-flex'}} >
				<p>{taskTitle}</p>
			</div>
			<IconButton icon='edit' onClick={() => setTitleEdit(true)} noBorder />
		</div>;
  
};

export default TaskTitle;