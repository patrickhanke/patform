import { FC } from "react";
import styles from "./TeamAssignment.module.scss";
import DisplayWorkers from "./components/DisplayWorkers";
import { TeamAssignmentsProps } from "@repo/types";

const TeamAssignment: FC<TeamAssignmentsProps> = ({
	propertyId,
	assignedStaff,
	refetch
}) => {
	return (
		<div className={styles.team_assignment_container}>
			<div className={styles.team_assignment_workers_container}>
				<DisplayWorkers
					propertyId={propertyId}
					assignedStaff={assignedStaff}
					refetch={refetch}
				/>
			</div>
		</div>
	);
};

export default TeamAssignment;
