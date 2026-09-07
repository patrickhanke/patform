import { PatflowUser } from "@repo/types";
import { Absence } from "./Absence";
import { DayTime, TimeObject } from "./Times";

export type RecordTimeSettings = {
	hours: number;
	weekdays: {
		index: number;
		start: string;
		end: string;
		breaks: DayTime["breaks"];
		saldo: number;
	}[];
	breaks: DayTime["breaks"];
	vacation: number;
	start: string;
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
