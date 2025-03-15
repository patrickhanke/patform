import React, { FC } from "react";
import styles from "./TeamAssignment.module.scss";
import DisplayWorkers from "./components/DisplayWorkers";
import { TeamAssignmentsProps } from "./types";

const TeamAssignment: FC<TeamAssignmentsProps> = ({
  workers,
  onChange,
  showAsButton = false,
}) => {
  return (
    <div className={styles.team_assignment_container}>
      <div className={styles.team_assignment_workers_container}>
        <DisplayWorkers
          showAsButton={showAsButton}
          workers={workers}
          onChange={onChange}
        />
      </div>
    </div>
  );
};

export default TeamAssignment;
