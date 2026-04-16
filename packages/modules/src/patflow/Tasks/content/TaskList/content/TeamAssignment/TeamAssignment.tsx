import { FC } from "react";
import DisplayWorkers from "./components/DisplayWorkers";
import { TeamAssignmentProps } from "./types";
import "./styles.scss";

const TaskTeamAssignments: FC<TeamAssignmentProps> = ({
	task,
	showAsButton = false,
	isEditable = true
}) => {
	return (
		<div className="team_assignment_container">
			<div className="team_assignment_workers_container">
				<DisplayWorkers
					task={task}
					showAsButton={showAsButton}
					selectWorkers={isEditable}
					propertyId={task.property?.objectId}
				/>
			</div>
		</div>
	);
};

export default TaskTeamAssignments;
