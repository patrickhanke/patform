import {date_category_options} from "@repo/ui";
import { weekdays } from "@repo/provider";

export interface Date {
  /**
   * Give a more precise return type to the method `toISOString()`:
   * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toISOString
   */
  toISOString(): TDateISO;
}

type TYear = `${number}${number}${number}${number}`;
type TMonth = `${number}${number}`;
type TDay = `${number}${number}`;
type THours = `${number}${number}`;
type TMinutes = `${number}${number}`;
type TSeconds = `${number}${number}`;
type TMilliseconds = `${number}${number}${number}`;

type TDateISODate = `${TYear}-${TMonth}-${TDay}`;

type TDateISOTime = `${THours}:${TMinutes}:${TSeconds}.${TMilliseconds}`;

export type TDateISO = string;

export type Weekdays = typeof weekdays;

export type DateInterval = {
  value: string;
  label: string;
  disabled?: boolean;
};

export type TaskTimeCategory =
  | { value: "single"; label: "Single" }
  | { value: "multi"; label: "Multi" }
  | { value: "interval"; label: "Interval" };

export type DateObject = {
  type: DateInterval;
  category: (typeof date_category_options)[number];
  interval: {
    number: number;
    unit: string;
  };
  dates: string[];
  start_date: string;
  end_date: string;
  weekday: string;
  time: string;
};

export type DateObjectWithNextDates = DateObject & { next_dates?: string[] };
