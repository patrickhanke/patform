import React from 'react';
import styles from './TaskIndicator.module.scss';

const TaskIndicator = ({taskState}: {taskState: string}) => {

	return (
		<div className={styles.task_indicator_container} data-state={taskState}>
       
		</div>
	);
};

export default TaskIndicator;