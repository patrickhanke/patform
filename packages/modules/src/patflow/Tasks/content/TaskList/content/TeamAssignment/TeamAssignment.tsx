import { FC } from "react";
import DisplayWorkers from "./components/DisplayWorkers";
import { TeamAssignmentProps } from "./types";
import "./styles.scss";

const TaskTeamAssignments: FC<TeamAssignmentProps> = ({
	task,
	refetch,
	showAsButton = false,
	isEditable = true
}) => {
	console.log("task", task);
	return (
		<div className="team_assignment_container">
			<div className="team_assignment_workers_container">
				<DisplayWorkers
					task={task}
					refetch={refetch}
					showAsButton={showAsButton}
					selectWorkers={isEditable}
				/>
			</div>
		</div>
	);
};

export default TaskTeamAssignments;
