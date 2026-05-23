import {
  DayTime,
  UserDisplayData,
  MakeOptional,
  User,
  StateColors,
  Absence,
  AbsenceTime,
  AbsenceType,
} from "@repo/types";

export type AbsenceStateOptions = [
  {
    value: "created";
    id: "created";
    label: "Erstellt";
    color: StateColors;
  },
  {
    value: "submitted";
    id: "submitted";
    label: "Eingereicht";
    color: StateColors;
  },
  {
    value: "approved";
    id: "approved";
    label: "Genehmigt";
    color: StateColors;
  },
];

export type DayAbsence = {
  id: string;
  start_date: string;
  end_date: string;
  comment: string;
  state: AbsenceStateOptions[number]["value"];
  user: User["objectId"];
  type: AbsenceType;
};

export type DaySurcharge = {
  saldo: number;
  balance: number;
  surcharge_id: string;
  compensated: boolean;
};

// compensation_times is used to compensate overtime

export type AbsenceTime = {
  type: AbsenceType;
  start: string;
  end: string;
  pause: number;
  breaks: {start: string; end: string; id: string;}[];
  duration: number;
  comment: string;
  state: "full" | "part";
};

type BasicDay = {
  id?: string;
  objectId: string;
  year: number;
  month: number;
  date: string;
  is_working_day: boolean;
  surcharges: Surcharge[];
  record: Record;
  user: UserDisplayData;
  default_time: DayTime | null;
  saldo: number;
  comment?: string;
  worktime: number;
};

type InitialDay = {
  time: null;
  absence: null;
  type: "initial";
};

type WorkDay = {
  time: DayTime;
  absence: null;
  type: "work";
};

type AbsenceDay = {
  time: AbsenceTime;
  absence: Absence;
  type: "absence";
};

export type Day = BasicDay & (WorkDay | AbsenceDay | InitialDay);

export type DefaultDay = MakeOptional<Day, "record" | "user" | "objectId">;

export type WorkingDay = BasicDay & WorkDay;

export type DefaultWorkingDay = MakeOptional<
  WorkingDay,
  "record" | "user" | "objectId"
> 
