import React, { FC } from 'react';
import styles from './TeamAssignment.module.scss';
import DisplayWorkers from './components/DisplayWorkers';
import { TeamAssignmentProps } from './types';

const TeamAssignments: FC<TeamAssignmentProps> = ({
    taskId,
    taskState,
    refetchTask,
    showAsButton = false,
}) => {
    return (
        <div className={styles.team_assignment_container}>
            <div className={styles.team_assignment_workers_container}>
                <DisplayWorkers
                    taskId={taskId}
                    taskState={taskState}
                    refetchTask={refetchTask}
                    showAsButton={showAsButton}
                    selectWorkers={
                        taskState === 'created' || taskState === 'assigned'
                    }
                />
            </div>
        </div>
    );
};

export default TeamAssignments;
