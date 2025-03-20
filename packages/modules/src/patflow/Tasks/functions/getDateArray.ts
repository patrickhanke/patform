import { task_date_options } from "@repo/provider";
import { ApplicationTypes } from "@repo/types";
import { addWeeks, formatISO9075, getISODay, setISODay } from "date-fns";
export const getDateArray = (
  value: (typeof task_date_options)[number]["value"],
): { operator: ApplicationTypes.FilterOperator; returnValue: string[] } => {
  let operator = "_in" as ApplicationTypes.FilterOperator;
  const returnValue: string[] = [];

  if (value === "today") {
    returnValue.push(formatISO9075(new Date(), { representation: "date" }));
  }
  if (value === "this_week") {
    for (let i = 1; i < 8; i += 1) {
      if (i >= getISODay(new Date())) {
        returnValue.push(
          formatISO9075(setISODay(new Date(), i), {
            representation: "date",
          }),
        );
      }
    }
  }
  if (value === "next_week") {
    const nextWeekDay = addWeeks(new Date(), 1);
    for (let i = 1; i < 8; i += 1) {
      returnValue.push(
        formatISO9075(setISODay(nextWeekDay, i), {
          representation: "date",
        }),
      );
    }
  }
  if (value === "no_date") {
    operator = "_eq";
  }

  return {
    operator,
    returnValue,
  };
};
