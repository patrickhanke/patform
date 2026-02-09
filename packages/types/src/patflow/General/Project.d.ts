import { ColorValues } from "@repo/ui";

export type PatflowProject = {
  objectId: string;
  logo: {
    url: string;
    name: string;
  };
  name: string;
  path: string;
  time_settings: TimeSettings;
  record_settings: RecordSettings;
};
export type SurchargeTypes = "time" | "day" | "overtime" | "work";

export type Surcharge = {
  objectId: string;
  name: string;
  type: SurchargeTypes;
  time_value: { start: string; end: string };
  day_value: string[];
  work_value: object;
  value: number;
  active: boolean;
  start_date: string;
  end_date: string | null;
  connected_records: string[];
  color: ColorValues;
  short: string;
  description: string;
};

export type RecordSettings = {
  surcharges: Surcharge[];
};

export type TimeSettings = {
  holidays: Holiday[];
};

export type Holiday = {
  date: string;
  name: string;
  comment: string;
  objectId: string;
  project: Project;
  dates: string[];
};
