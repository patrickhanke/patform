import { ApolloRefetch, months } from "@repo/provider";
import { AbsenceTime, Day, DayTime } from "@repo/types";

export type StaffWorkingTimesProps = {
	month: (typeof months)[number];
	year: number;
	days: Day[];
	refetch: ApolloRefetch;
	selectedUser: { value: string; label: string };
	records: Record[];
};

export type DayDataTime = {
	saldo: number;
	time: DayTime | AbsenceTime;
	day_id?: string;
	absence?: Day["absence"];
	type?: "absence" | "work";
	worktime: number;
};

export type DayData = {
	date: Day["date"];
	is_working_day: Day["is_working_day"];
	default_time: Day["default_time"];
	times: DayDataTime[];
	surcharges: Day["surcharges"];
	comment: Day["comment"];
	time?: DayTime;
	absence?: Day["absence"];
	type?: "work" | "absence" | "initial";
};

export type ColumnWorkingTimeProps = {
	type: DayData["type"];
	times: DayData["times"];
	date: string;
	days?: Day[];
	refetch: ApolloRefetch;
	userId: string;
	records: Record[];
};
