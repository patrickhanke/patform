import { UserDisplayData } from "@/types/General";
import { AbsenceStateOptions } from "../Day";

export type AbsenceType = "vacation" | "illness" | "compensation_times" | "payed_absence";

export type Absence = {
  objectId: string;
  state: AbsenceStateOptions[number]["value"];
  user: UserDisplayData;
  comment: string;
  type: AbsenceType;
  year: number;
  start_date: string;
  end_date: string;
};
