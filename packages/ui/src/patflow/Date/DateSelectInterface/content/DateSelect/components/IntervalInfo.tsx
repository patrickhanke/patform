import React from "react";
import styles from "../DateSelect.module.scss";
import { IntervalInfoProps } from "../types";
import { getDateString } from "@provider";

const IntervalInfo = ({ dates }: IntervalInfoProps) => {
  return (
    <div className={styles.interval_info_container}>
      <label>Terminvorschau</label>
      <div className={styles.interval_info_content}>
        {dates.map((date) => (
          <div key={date} className={styles.interval_info_element}>
            <p>
              {getDateString(date).date} - {getDateString(date).time}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default IntervalInfo;
