import { WorkingTimes } from "./types.d";
import { ApolloRefetch, Day, DefaultDay } from "@repo/types";
import { Dispatch, SetStateAction } from "react";
import { WeekObject } from "../../types";

export type EditRecordProps = {
  userId: string;
  weekDays: WeekObject["days"];
  refetch: ApolloRefetch;
  selectedWeek: number;
};

export type RecordTimeDisplayProps = {
  day: WorkingTime;
  currentIndex: number;
  setCurrentIndex: Dispatch<SetStateAction<number>>;
  index: number;
};

export type EditTimeProps = {
  day: WorkingTime;
  timeChangeHandler: RecordTimeDisplayProps["timeChangeHandler"];
  workingTimes: WorkingTime[];
  selectedWeek: number;
  deleteDay: (type: "objectId" | "id", id: string) => void;
  userId: string;
};

export type WorkingTime = Day | DefaultDay;

export type WorkingTimes = Array<WorkingTime>;
