import { months } from "@repo/provider";
import { Day } from "@repo/types";
import { UserDisplayData } from "@repo/types";

export type RecordsStaffOverviwProps = {
  year: number;
};

export type MonthOptions = {
  id: 13;
  value: "all";
  label: "Alle Monate";
} & typeof months;

export type StaffOption = { value: string; label: string } & UserDisplayData;

export type SiteHeaderContentProps = {
  setSelectedMonth: Dispatch<SetStateAction<tMonthOptions[number]>>;
  selectedMonth: MonthOptions[number];
  setSelectedUser: Dispatch<SetStateAction<StaffOption>>;
  selectedUser: StaffOption | null;
  displayStates: typeof site_states;
  displayState: (typeof site_states)[0];
  setDisplayState: Dispatch<SetStateAction<(typeof site_states)[0]>>;
};

export type TableData = Day;

export type UseGetDay = (P: { year: number; user?: string }) => {
  loading: boolean;
  days: Day[];
  refetch: () => void;
};

export type DayData = {
  type: Day["type"];
  date: Day["date"];
  is_working_day: Day["is_working_day"];
  default_time: Day["default_time"];
  absence: Day["absence"];
  time?:
    | Day<"work" | "absence">["time"]
    | Array<Day<"work" | "absence">["time"]>;
};
