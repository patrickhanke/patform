import { EventTime } from "@repo/types";
import { Updater } from "use-immer";

export type TableColumnTimesFieldProps = {
  initialTimes: EventTime[];
  onChange: (times: EventTime[]) => Promise<void>;
};

export type TableColumnTimeProps = {
  time: EventTime;
  setActiveTime: (id: string) => void;
};

export type TableColumnEditTimeProps = {
  time?: EventTime;
  setTimes: Updater<EventTime[]>;
};
