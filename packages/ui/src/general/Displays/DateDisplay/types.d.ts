import { DateTypes } from "@repo/types";

export type DisplayType = "date" | "time" | "date-and-time";

export type DateDisplayComponent = {
  date: DateTypes.TDateISO;
  displayType: DisplayType;
};
