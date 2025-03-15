import React from "react";
import styles from "./ProgressBar.module.scss";

const ProgressBar = ({ completed }: { completed: number }) => {
  return (
    <div className={styles.progress_bar_container}>
      <p>Fortschritt: </p>
      <div className={styles.progress_bar}>
        <div
          className={styles.filler_styles}
          style={{ width: `${completed}%` }}
        ></div>
      </div>
      <p>{`${Math.round(completed)}%`}</p>
    </div>
  );
};

export default ProgressBar;
