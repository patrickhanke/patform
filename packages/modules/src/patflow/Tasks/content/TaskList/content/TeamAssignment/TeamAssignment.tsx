import { FC } from "react";
import DisplayWorkers from "./components/DisplayWorkers";
import { TeamAssignmentProps } from "./types";
import "./styles.scss";

const TeamAssignments: FC<TeamAssignmentProps> = ({
	taskId,
	taskState,
	refetchTask,
	showAsButton = false
}) => {
	return (
		<div className="team_assignment_container">
			<div className="team_assignment_workers_container">
				<DisplayWorkers
					taskId={taskId}
					taskState={taskState}
					refetchTask={refetchTask}
					showAsButton={showAsButton}
					selectWorkers={
						taskState === "created" || taskState === "assigned"
					}
				/>
			</div>
		</div>
	);
};

export default TeamAssignments;
