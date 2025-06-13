import { Absence } from "../Worker";

export type DayTime = {
  type: "regular" | "work";
  start: string;
  end: string;
  pause: number;
  duration: number;
  comment: string;
  state: "created" | "submitted" | "approved" | "initial";
};

export type TimeObject = {
  absence: Absence | null;
  default_time: DayTime | null;
  time: DayTime | null;
  type: "absence" | "time" | null;
  is_working_day: boolean;
  date: string;
};

export type MonthIndex =
  | "0"
  | "1"
  | "2"
  | "3"
  | "4"
  | "5"
  | "6"
  | "7"
  | "8"
  | "9"
  | "10"
  | "11";

export type Month = {
  default_values: {
    duration: number;
    breaks: number;
  };
  holidays: number;
  absence: number;
  vacation: number;
  duration: number;
  breaks: number;
  working_days: number;
  days: TimeObject[];
};

export type Times = Record<MonthIndex, Month>;
