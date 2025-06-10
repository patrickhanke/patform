import { months } from "@repo/provider";
import { UserDisplayData } from "@repo/types";

export type StaffRecordProps = {
	days: RecordData;
	month: (typeof months)[number];
	year: number;
	user: UserDisplayData;
};

export type MonthData = {
	month: string;
	monthSaldo: string;
	target: string;
	monthTimes: string;
};
