import { ApolloRefetch, months } from "@repo/provider";
import { Day } from "@repo/types";

export type StaffWorkingTimesProps = {
	month: (typeof months)[number];
	year: number;
	days: Day[];
	refetch: ApolloRefetch;
	selectedUser: { value: string; label: string };
	records: Record[];
};

export type DayDataTime = Day["time"] & { day_id?: string };

export type DayData = {
	type: Day["type"];
	date: Day["date"];
	is_working_day: Day["is_working_day"];
	default_time: Day["default_time"];
	absence: Day["absence"];
	time?: Array<DayDataTime> | null;
	surcharges: Day["surcharges"];
};

export type ColumnWorkingTimeProps = {
	type: DayData["type"];
	time: DayData["time"];
	date: string;
	refetch: ApolloRefetch;
	userId: string;
	records: Record[];
};
