import React, { useMemo } from "react";
import { CalendarDayProps } from "./types";
import styles from "./CalendarDay.module.scss";
import { isMonday, isToday } from "date-fns";

const CalendarDay = ({ day, currentInterval, data }: CalendarDayProps) => {
  const values = useMemo(() => {
    const dayLabel = new Date(day).getDate();
    return {
      dayLabel,
    };
  }, []);

  return (
    <div
      className={styles.day_container}
      data-out_of_interval={!currentInterval.includes(day)}
      data-is_today={isToday(new Date(day))}
    >
      <div className={styles.day_label}>
        <p>{values.dayLabel}</p>
      </div>
      <div className={styles.data_container}>
        {data[day] &&
          data[day]
            .sort((a, b) => b.length - a.length)
            .map((data) => {
              return (
                <div
                  key={data.objectId}
                  className={styles.data_element}
                  data-type={data.dataType}
                  data-length={data.dataLength}
                  data-is_last={data.dataIndex === data.dataLength - 1}
                  style={{ backgroundColor: data.dataColor }}
                >
                  {data.dataType === "absence" && (
                    <div className={styles.data_element_title}>
                      {(data.dataIndex === 0 || isMonday(new Date(day))) && (
                        <p>{data.dataTitle}</p>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
      </div>
    </div>
  );
};

export default CalendarDay;
