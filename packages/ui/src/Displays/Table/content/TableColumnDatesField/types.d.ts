import { EventDate } from "@repo/types";
import { Updater } from "use-immer";

export type TableColumnDatesFieldProps = {
  initialDates: EventDate[];
  onChange: (dates: EventDate[]) => Promise<void>;
};

export type TableColumnDateProps = {
  date: EventDate;
  setActiveDate: (id: string) => void;
};

export type TableColumnEditDateProps = {
  date?: EventDate;
  setDates: Updater<EventDate[]>;
};
