import { User, UserDisplayData } from "@/types/General";
import { Absence, AbsenceType } from "./Absence";
import { DayTime, TimeObject } from "./Times";
import { AbsenceStateOptions, Surcharge } from "@repo/types";

export type RecordTimeSettings = {
  hours: number;
  weekdays: number;
  breaks: DayTime["breaks"];
  vacation: number;
  start: string;
};

export type Record = {
  objectId: string;
  createdAt: string;
  updatedAt: string;
  year: number;
  user: User;
  absence: Absence[];
  default_times: TimeObject[];
  start_date: string;
  end_date: string;
  time_settings: RecordTimeSettings;
  absence_days: number;
  saldo: number;
  former_record: Record | undefined;
  surcharges: string[]
};