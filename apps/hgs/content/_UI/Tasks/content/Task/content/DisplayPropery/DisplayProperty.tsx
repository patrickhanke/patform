import React from 'react';
import styles from './DisplayProperty.module.scss';
import { Loader, StateDisplay } from '@/content/_UI';
import { useQuery } from '@apollo/client';
import { GET_TASK_PROPERTY } from '@/queries';

const DisplayProperty = ({taskId}: {taskId: string}) => {
	const {data} = useQuery(GET_TASK_PROPERTY, {
		variables: {id: taskId}
	});
	
	if (data) return (
		<div className={styles.object_container} >
			<StateDisplay<'no-state'>
				type='Task'
				color='light'
				label={data.objects.getTask.property?.name || 'Kein Objekt zugewiesen'}
				icon='house'
				noBackground
			/>
		
		</div>
	);

	return <Loader width='30px' height='18px' />;
};

export default DisplayProperty;