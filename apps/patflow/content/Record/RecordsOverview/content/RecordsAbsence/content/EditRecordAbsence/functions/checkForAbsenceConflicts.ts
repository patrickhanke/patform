import { Absence } from "@types";
import { eachDayOfInterval, formatISO9075 } from "date-fns";
import { cloneDeep } from "lodash-es";

const checkForAbsenceConflicts = (
  start_date: string,
  end_date: string,
  absences: Absence[],
  absenceId?: string,
) => {
  const doubleBookedDays: string[] = [];

  const absencesDateArray: string[] = [];

  let absencesCopy = cloneDeep(absences);
  if (absenceId) {
    absencesCopy = absencesCopy.filter(
      (absence) => absence.objectId !== absenceId,
    );
  }

  absencesCopy.forEach((absence) => {
    const absenceInterval = eachDayOfInterval(
      {
        start: new Date(absence.start_date),
        end: new Date(absence.end_date),
      },
      { step: 1 },
    );
    const formatedAbsenceInterval = absenceInterval.map((day) =>
      formatISO9075(day, { representation: "date" }),
    );
    absencesDateArray.push(...formatedAbsenceInterval);
  });

  const absenceDateArray = eachDayOfInterval(
    {
      start: new Date(start_date),
      end: new Date(end_date),
    },
    { step: 1 },
  );

  const formattedAbsenceDateArray: string[] = absenceDateArray.map((day) =>
    formatISO9075(day, { representation: "date" }),
  );

  formattedAbsenceDateArray.forEach((date) => {
    if (absencesDateArray.includes(date)) {
      doubleBookedDays.push(date);
    }
  });
  return doubleBookedDays;
};

export default checkForAbsenceConflicts;
