import React from "react";
import styles from "./TeamAssignment.module.scss";
import DisplayWorkers from "./components/DisplayWorkers";
import { TeamAssignmentsProps } from "@types";

const TeamAssignment = ({
  propertyId,
  showAsButton = false,
}: TeamAssignmentsProps) => {
  return (
    <div className={styles.team_assignment_container}>
      <div className={styles.team_assignment_workers_container}>
        <DisplayWorkers propertyId={propertyId} showAsButton={showAsButton} />
      </div>
    </div>
  );
};

export default TeamAssignment;
