import React from 'react';
import styles from './TeamAssignment.module.scss';
import DisplayWorkers from './components/DisplayWorkers';
import { TeamAssignmentsProps } from '@/types';

const TeamAssignments = ({taskId, taskState, refetchTask, showAsButton=false}: TeamAssignmentsProps) => {
	return (
		<div className={styles.team_assignment_container}>
			<div className={styles.team_assignment_workers_container}>
				<DisplayWorkers
					taskId={taskId}
					taskState={taskState}
					refetchTask={refetchTask}
					showAsButton={showAsButton}
					selectWorkers={taskState === 'created' || taskState === 'assigned'}
				/>
			</div>
		</div>
	);
};

export default TeamAssignments;