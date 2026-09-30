import { EventTime, ModuleFieldTimesSettings } from "@repo/types";
import { Updater } from "use-immer";

export type TableColumnTimesFieldProps = {
	initialTimes: EventTime[];
	onChange: (times: EventTime[]) => Promise<void>;
	settings?: ModuleFieldTimesSettings;
};

export type TableColumnTimeProps = {
	time: EventTime;
	setActiveTime: (id: string) => void;
	onDeleteTime: (id: string) => void;
};

export type TableColumnEditTimeProps = {
	time?: EventTime;
	setTimes: Updater<EventTime[]>;
	settings?: ModuleFieldTimesSettings;
};
