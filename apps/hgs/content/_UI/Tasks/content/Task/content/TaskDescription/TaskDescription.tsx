import { Loader, TextInput } from '@content';
import { useDataHandler } from '@provider';
import { GET_TASK_DESCRIPTION } from '@queries';
import { useQuery } from '@apollo/client';
import React, { useEffect } from 'react';
import styles from './TaskDescription.module.scss';
import { useDebounceValue } from 'usehooks-ts';


const TaskDescription = ({taskId}: {taskId: string}) => {
	const {updateData} = useDataHandler();
	const [description, setDescription] = useDebounceValue('', 2000);
 
	const {data, refetch} = useQuery(GET_TASK_DESCRIPTION, {
		variables: {id: taskId},
		notifyOnNetworkStatusChange: true
	});

	const descriptionDataHandler = async (value: string) => {
		await updateData({
			className: 'Task',
			objectId: taskId,
			updateObject: {
				description: value
			}
		});
		refetch();
	};


	useEffect(() => {
		if (data && description && description !== data?.objects.getTask.description) {
			descriptionDataHandler(description);
		}
	}, [description]);

	if (data) return  (
		<div className={styles.description_content_text}>
			<TextInput 
				id='description'
				defaultValue={data.objects.getTask.description}
				onChange={(inputValue: string) => setDescription(inputValue)}
				isTextArea
			/>
		</div>
	);

	return <Loader width='100%' height='66px' />;
};

export default TaskDescription;