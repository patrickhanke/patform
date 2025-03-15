import React from "react";
import styles from "../CreateRecord.module.scss";
import { UserSelectProps } from "../types";

const UserSelect = ({ worker, isSelected, onChange }: UserSelectProps) => {
  return (
    <button
      className={styles.display_worker_container}
      data-isselected={isSelected}
      onClick={() => onChange(isSelected ? "remove" : "add", worker.objectId)}
    >
      <div className={styles.display_worker_container_pers_data}>
        <div className={styles.display_worker_image_container} />
        <h4>{`${worker.first_name} ${worker.family_name}`}</h4>
      </div>
    </button>
  );
};

export default UserSelect;
