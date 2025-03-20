import {
  DayTime,
  UserDisplayData,
  MakeOptional,
  User,
  StateColors,
  Absence,
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
  type: "illness" | "vacation" | "other";
};

export type DaySurcharge = {
  saldo: number;
  balance: number;
  surcharge_id: string;
  compensated: boolean;
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
  time: null;
  absence: Absence;
  type: "absence";
};

export type Day = BasicDay & (WorkDay | AbsenceDay | InitialDay);

export type DefaultDay = MakeOptional<Day, "record" | "user" | "objectId">;
