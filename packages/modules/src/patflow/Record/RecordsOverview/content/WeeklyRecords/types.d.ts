import { ApolloRefetch, Record } from "@repo/types";

export type GetRecordObject = {
  loading: boolean;
  record: Record;
  refetch: () => void;
};

export type WeekObject = {
  user: string;
  state: "submitted" | "approved" | "rejected";
  working_days: number;
  holidays: number;
  absence: number;
  vacation: number;
  time: number;
  breaks: number;
  saldo: number;
  days: Day[];
};

export type DateMonthRecord = WeekObject;

export type WeeklyRecordProps = {
  records: Record[];
  refetch: ApolloRefetch;
  loading: boolean;
  filters: ApplicationTypes.Filter[];
  setFilters: React.Dispatch<React.SetStateAction<ApplicationTypes.Filter[]>>;
};

export type DayState = "open" | "completed" | "vacation" | "sick" | "holiday";

export type SiteHeaderContentComponent = {
  id?: string;
  filters: ApplicationTypes.Filter[];
  setFilters: React.Dispatch<React.SetStateAction<ApplicationTypes.Filter[]>>;
  selectedWeek: number;
  setSelectedWeek: React.Dispatch<React.SetStateAction<number>>;
};
