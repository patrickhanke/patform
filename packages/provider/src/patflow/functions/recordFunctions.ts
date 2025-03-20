import {
  CreateInitialTime,
  DefaultDay,
  Holiday,
  Record,
  TimeObject,
} from "@repo/types";
import {
  eachDayOfInterval,
  formatISO9075,
  hoursToMilliseconds,
  isWeekend,
  minutesToMilliseconds,
  isSunday,
  isFriday,
  isThursday,
  isWednesday,
  isMonday,
} from "date-fns";
import { isArray } from "lodash-es";

const checkForWorkingDay: (
  date: Date,
  weekdays: number,
  holidays: string[],
) => boolean = (date: Date, weekdays, holidays) => {
  if (holidays.includes(formatISO9075(date, { representation: "date" }))) {
    return false;
  }
  if (weekdays === 6 && isSunday(date)) {
    return false;
  }
  if (weekdays === 5 && isWeekend(date)) {
    return false;
  }
  if (weekdays === 4 && (isWeekend(date) || isFriday(date))) {
    return false;
  }
  if (
    weekdays === 3 &&
    (isWeekend(date) || isFriday(date) || isThursday(date))
  ) {
    return false;
  }
  if (
    weekdays === 2 &&
    (isWeekend(date) || isFriday(date) || isThursday(date) || isWednesday(date))
  ) {
    return false;
  }
  if (
    weekdays === 1 &&
    (isWeekend(date) ||
      isFriday(date) ||
      isThursday(date) ||
      isWednesday(date) ||
      isMonday(date))
  ) {
    return false;
  }

  return true;
};

export const createInitialTimes: (
  T: CreateInitialTime["props"],
) => CreateInitialTime["return"] = ({
  start_date,
  end_date,
  timeSettings,
  holidays,
}) => {
  const times: TimeObject[] = [];

  const createTimeObject: (day: Date) => TimeObject = (day) => {
    const isWorkingDay = checkForWorkingDay(
      day,
      timeSettings.weekdays,
      holidays,
    );
    // const isHoliday = holidays.includes(formatISO9075(day, {representation: 'date'}));
    const timeObject: TimeObject = {
      date: formatISO9075(new Date(day), { representation: "date" }),
      absence: null,
      default_time: null,
      time: null,
      type: isWorkingDay ? "time" : null,
      is_working_day: isWorkingDay,
    };

    if (isWorkingDay) {
      timeObject.default_time = {
        type: "regular",
        start: timeSettings.start || "8:00",
        end: "",
        pause: minutesToMilliseconds(timeSettings.pause),
        duration:
          hoursToMilliseconds(timeSettings.hours / timeSettings.weekdays) +
          minutesToMilliseconds(timeSettings.pause),
        comment: "",
        state: "initial",
      };
    }
    return timeObject;
  };

  const dayInterval = eachDayOfInterval(
    {
      start: new Date(start_date),
      end: new Date(end_date),
    },
    { step: 1 },
  );

  dayInterval.forEach((day) => {
    times.push(createTimeObject(day));
  });

  return {
    default_times: times,
    dates: dayInterval.map((day) =>
      formatISO9075(day, { representation: "date" }),
    ),
  };
};

export const getDefaultTime: (date: string) => DefaultDay = (date) => ({
  objectId: "",
  month: new Date(date).getMonth(),
  year: new Date(date).getFullYear(),
  date: formatISO9075(new Date(date), { representation: "date" }),
  is_working_day: true,
  absence: null,
  saldo: 0,
  type: "work",
  default_time: null,
  surcharges: [],
  time: {
    type: "regular",
    start: "",
    end: "",
    pause: 0,
    comment: "",
    duration: 0,
    state: "initial",
  },
});

export const createDateIntervalForMonth: (
  year: number,
  month: number,
) => string[] = (year, month) => {
  const startDay = new Date(year, month, 1);
  const endDay = new Date(year, month + 1, 0);
  const interval = eachDayOfInterval(
    {
      start: startDay,
      end: endDay,
    },
    { step: 1 },
  );
  return interval.map((day) => formatISO9075(day, { representation: "date" }));
};

export const findDefaultTimeForDate: (
  date: string,
  records: Record[],
) => TimeObject = (date, records) => {
  let default_time: TimeObject = {
    date,
    is_working_day: false,
    default_time: null,
    time: null,
    absence: null,
    type: null,
  };

  records.forEach((record) => {
    const rec_default_time = record.default_times?.find(
      (day) => day.date === date,
    );
    if (rec_default_time) {
      default_time = rec_default_time;
    }
  });

  return default_time;
};

export const getHolidayDates = (y: number, hds: Holiday[]): string[] => {
  const dateArray: string[] = [];

  if (!isArray(hds)) {
    return [];
  }

  hds.forEach((hd: Holiday) => {
    if (hd.dates && hd.dates[y.toString()]) {
      dateArray.push(hd.dates[y.toString()]);
    }
  });

  return dateArray;
};
