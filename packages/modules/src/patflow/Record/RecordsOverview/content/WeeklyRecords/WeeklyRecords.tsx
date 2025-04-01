import React, { useContext, useMemo, useState } from "react";
import { WeeklyRecordProps, WeekObject } from "./types";
import { PatflowAppContext, getWeekDayKeys } from "@repo/provider";
import useTableColumns from "./hooks/useTableColumns";
import SiteHeaderContent from "./components/SiteHeaderContent";
import { getWeek, hoursToMilliseconds } from "date-fns";
import initialFilters from "./constants/initialFilters";
import { Day, StaffMember } from "@repo/types";
import { useQuery } from "@apollo/client";
import { find_day } from "@repo/provider";
import { FIND_ALL_STAFF } from "@repo/provider";
import { cloneDeep } from "lodash-es";
import { Divider, Table } from "@repo/ui";

const WeeklyRecords = ({
  records,
  filters,
  setFilters,
  loading,
}: WeeklyRecordProps) => {
  const [selectedWeek, setSelectedWeek] = useState(
    getWeek(new Date(), { weekStartsOn: 1 }),
  );
  const { data: dayData, refetch } = useQuery(find_day, {
    variables: { params: { date: { _in: getWeekDayKeys(selectedWeek) } } },
  });
  const { data: staffData } = useQuery(FIND_ALL_STAFF);
  const columns = useTableColumns({ selectedWeek, refetch });
  const { year } = useContext(PatflowAppContext);

  const weekData = useMemo(() => {
    const weekArray: WeekObject[] = [];
    if (staffData && dayData) {
      const staff = staffData.objects.find_User.results;
      const days = cloneDeep(dayData?.objects.findDay.results) || [];
      staff.forEach((staffMember: StaffMember) => {
        const record = records.find((record) => record.year === year);
        const weekObject: WeekObject = {
          user: staffMember.objectId,
          state: "submitted",
          working_days: 0,
          holidays: 0,
          absence: 0,
          vacation: 0,
          time: 0,
          breaks: 0,
          saldo: record
            ? -hoursToMilliseconds(record.time_settings.hours)
            : -hoursToMilliseconds(40),
          days: [],
        };
        const dayArray: Day[] = [];
        days.forEach((dayToFind: Day) => {
          if (
            dayToFind.user &&
            dayToFind.user.objectId === staffMember.objectId &&
            getWeekDayKeys(selectedWeek).includes(dayToFind.date)
          ) {
            dayArray.push(dayToFind);
          }
        });

        const dateArray: string[] = [];

        dayArray.forEach((day: Day) => {
          if (day.type === "absence" && day.is_working_day) {
            dateArray.push(day.date);
            if (day?.absence?.type === "vacation") {
              weekObject.vacation += 1;
            } else {
              weekObject.absence += 1;
            }
            if (day.is_working_day) {
              weekObject.time += day?.default_time?.duration || 0;
              weekObject.breaks += day?.default_time?.pause || 0;
              weekObject.saldo +=
                (day?.default_time?.duration || 0) -
                (day?.default_time?.pause || 0);
            }
          }

          if (day.type === "work" && day?.time) {
            if (!dateArray.includes(day.date)) {
              weekObject.working_days += 1;
            }
            weekObject.time += day.time.duration;
            weekObject.breaks += day.time.pause;
            weekObject.saldo += day.time.duration - day.time.pause;
          }
          weekObject.days.push(day);
        });

        weekArray.push(weekObject);
      });
    }
    return weekArray;
  }, [records, selectedWeek, staffData, dayData]);

  const siteHeaderContent = useMemo(
    () => (
      <SiteHeaderContent
        filters={filters}
        setFilters={setFilters}
        setSelectedWeek={setSelectedWeek}
        selectedWeek={selectedWeek}
      />
    ),
    [records, filters, selectedWeek],
  );

  return (
    <>
      <div className="horizontal_container">
        <div className="button_container">{siteHeaderContent}</div>
        <button
          className="full_button dark md"
          onClick={() => {
            setFilters(initialFilters);
          }}
        >
          Filter zurücksetzen
        </button>
      </div>
      <Divider size="small" showLine={false} />
      <div className="content_element no_padding">
        <Table columns={columns} data={weekData} key={selectedWeek} />
      </div>
    </>
  );
};

export default WeeklyRecords;
