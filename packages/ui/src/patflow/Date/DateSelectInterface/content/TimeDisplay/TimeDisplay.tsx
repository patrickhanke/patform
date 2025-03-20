import React from "react";
import { MdEventRepeat } from "react-icons/md";
import styles from "./TimeDisplay.module.scss";
import clsx from "clsx";
import { DateObject } from "@repo/types";

const TimeDisplay = ({
  date,
  onClick,
}: {
  date: DateObject;
  onClick?: () => void;
}) => {
  return (
    <button
      className={clsx("full_button", "md", "primary")}
      data-interval={date.type?.label ? true : false}
      onClick={onClick}
    >
      <MdEventRepeat />
      {date?.type ? (
        <span className={clsx(styles.interval, "label")}>
          {date.type?.label}
        </span>
      ) : (
        <span className={clsx(styles.no_interval, "label")}>Keine Angabe</span>
      )}
    </button>
  );
};

export default TimeDisplay;
