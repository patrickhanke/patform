import React, { useMemo } from "react";
import styles from "../EditRecord.module.scss";
import {
  convertMillisecondsToString,
  getDateString,
  weekdays,
} from "@repo/provider";
import { RecordTimeDisplayProps } from "../types";
import clsx from "clsx";
import { getDay } from "date-fns";

const RecordTimeDisplay = ({
  setCurrentIndex,
  day,
  currentIndex,
  index,
}: RecordTimeDisplayProps) => {
  const isTime: boolean = useMemo(() => {
    if (day.type === "work") {
      return true;
    }
    return false;
  }, []);

  const dayLabel = (date: string) => {
    let label = "-";
    if (date) {
      label = `${weekdays.find((weekday) => weekday.day === getDay(new Date(day.date)))?.label} - ${getDateString(date).date}`;
    }

    return label;
  };

  return (
    <div
      className={
        isTime
          ? clsx(styles.content_button, "content_element")
          : "content_element"
      }
      data-active={index === currentIndex}
      onClick={() => isTime && setCurrentIndex(index)}
    >
      <div className={styles.time_display_content}>
        <div className={styles.time_display_title}>{dayLabel(day.date)}</div>
        {isTime ? (
          <>
            <div className="time_display_element">
              <div className="label">Start</div>
              <div className="time_display_element_content">
                {getDateString(day.time?.start).date}
              </div>
            </div>
            <div className="time_display_element">
              <div className="label">Ende</div>
              <div className="time_display_element_content">
                {getDateString(day.time?.end).time}
              </div>
            </div>
            <div className="time_display_element">
              <div className="label">Pause</div>
              <div className="time_display_element_content">
                {convertMillisecondsToString(day.time?.pause)}
              </div>
            </div>
            <div className="time_display_element">
              <div className="label">Arbeitszeit</div>
              <div className="time_display_element_content">
                {day.time?.duration &&
                  convertMillisecondsToString(
                    day.time?.duration - day.time?.pause,
                  )}{" "}
                Stunden
              </div>
            </div>
          </>
        ) : (
          <div className="time_display_element">
            <p>Abwesend</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecordTimeDisplay;
