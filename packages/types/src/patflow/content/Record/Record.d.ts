import { PatflowUser } from "@repo/types";
import { Absence } from "./Absence";
import { DayTime, TimeObject } from "./Times";

export type RecordWeekdaySetting = {
	/** Index of the weekday, 0 = Monday ... 6 = Sunday */
	index: number;
	/** "HH:mm" */
	start: string;
	/** "HH:mm" */
	end: string;
	/** Break intervals as "HH:mm" */
	breaks: DayTime["breaks"];
	/** Derived: net working time of the day in milliseconds */
	saldo: number;
};

export type RecordTimeSettings = {
	/** Derived: sum of all weekday saldos in hours */
	hours: number;
	weekdays: RecordWeekdaySetting[];
	vacation: number;
};

export type Record = {
	objectId: string;
	createdAt: string;
	updatedAt: string;
	year: number;
	user: PatflowUser;
	absence: Absence[];
	default_times: TimeObject[];
	start_date: string;
	end_date: string;
	time_settings: RecordTimeSettings;
	absence_days: number;
	saldo: number;
	former_record: Record | undefined;
	surcharges: string[];
};
