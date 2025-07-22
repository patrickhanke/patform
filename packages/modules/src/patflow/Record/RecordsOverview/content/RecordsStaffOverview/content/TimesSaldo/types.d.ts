import { months } from "@repo/provider";
import { StaffMember } from "@repo/types";
import { Record } from "@repo/types";

export type TimesSaldoProps = {
	days: RecordData;
	month: (typeof months)[number];
	year: number;
	selectedUser?: StaffMember;
	records: Record[];
};

export type MonthData = {
	id: number;
	month: string;
	monthSaldoInt: number;
	monthSaldo: string;
	target: string;
	monthTimes: string;
};
