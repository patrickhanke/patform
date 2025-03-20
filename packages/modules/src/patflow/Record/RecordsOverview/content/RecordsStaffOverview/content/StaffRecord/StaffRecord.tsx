import React, { useMemo } from "react";
import { MonthData, StaffRecordProps } from "./types";
import {
  convertMillisecondsToString,
  createDateIntervalForMonth,
  findDefaultTimeForDate,
  months,
} from "@provider";
import { Day } from "@types";
import { find_record } from "@queries";
import { useQuery } from "@apollo/client";
import styles from "./StaffRecord.module.scss";
import useTableColumns from "./hooks/useTableColumns";
import { Table } from "@repo/ui";

const StaffRecord = ({ days, year, user }: StaffRecordProps) => {
  const { data: recordData } = useQuery(find_record, {
    variables: {
      params: { year: { _eq: year }, user: { _eq: user.objectId } },
    },
    skip: !year,
  });

  const columns = useTableColumns();

  const monthData = useMemo(() => {
    const dataArray: MonthData[] = [];
    let totalSaldo = 0;
    let totalTarget = 0;
    let totalTimes = 0;
    if (!days && !recordData) {
      return dataArray;
    }

    months.forEach((month) => {
      const dateInterval = createDateIntervalForMonth(year, month.id);
      let target = 0;
      let monthTimes = 0;
      const record_default_times = dateInterval.map((dateElement) =>
        findDefaultTimeForDate(
          dateElement,
          recordData?.objects.findRecord.results || [],
        ),
      );
      record_default_times.forEach((element) => {
        let default_time = 0;
        if (element.default_time?.type === "regular") {
          default_time =
            element.default_time?.duration - element.default_time?.pause;
        }
        target += default_time;
      });
      if (days && recordData) {
        dateInterval.forEach((dayString) => {
          const dayArray = days.filter(
            (dayToFind: Day) => dayToFind.date === dayString,
          );

          if (dayArray.length > 1) {
            dayArray.forEach((day: Day) => {
              if (day && day.type === "work") {
                const time = day.time;
                const timeSpan = time.duration - time.pause;
                monthTimes += timeSpan || 0;
              }
            });
          } else if (dayArray.length === 1) {
            const day = dayArray[0];
            if (day && day.type === "work") {
              const time = day.time;
              const timeSpan = time.duration - time.pause;
              monthTimes += timeSpan || 0;
            } else if (day && day.type === "absence") {
              if (day.is_working_day) {
                monthTimes += day.default_time
                  ? day.default_time.duration - day.default_time.pause
                  : 0;
              }
            }
          }
        });
      }
      totalSaldo += monthTimes - target;
      totalTarget += target;
      totalTimes += monthTimes;
      dataArray.push({
        month: month.label,
        monthSaldo: convertMillisecondsToString(monthTimes - target),
        target: convertMillisecondsToString(target),
        monthTimes: convertMillisecondsToString(monthTimes),
      });
    });

    dataArray.push({
      month: "Gesamt",
      monthSaldo: convertMillisecondsToString(totalSaldo),
      target: convertMillisecondsToString(totalTarget),
      monthTimes: convertMillisecondsToString(totalTimes),
    });

    return dataArray;
  }, [days, year, recordData]);

  return (
    <div className={styles.staff_records_container}>
      <div>
        <h3>
          {user.first_name} {user.family_name}
        </h3>
      </div>
      <div className="content_element no_padding">
        <Table
          data={monthData}
          columns={columns}
          rowStyles={() => ({ textAlign: "right" })}
        />
      </div>
    </div>
  );
};

export default StaffRecord;
