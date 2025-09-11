import { months } from "@repo/provider";
import { Day, StaffMember } from "@repo/types";
import { UserDisplayData } from "@repo/types";

export type StaffOption = { value: string; label: string } & UserDisplayData;

export type RecordsStaffOverviwProps = {
	year: number;
	selectedUser: StaffOption | null;
	setSelectedUser: Dispatch<SetStateAction<StaffOption | null>>;
};

export type MonthOptions = {
	id: 13;
	value: "all";
	label: "Alle Monate";
} & typeof months;

export type SiteHeaderContentProps = {
	setSelectedMonth: Dispatch<SetStateAction<tMonthOptions[number]>>;
	selectedMonth: MonthOptions[number];
	setSelectedUser: Dispatch<SetStateAction<StaffOption>>;
	selectedUser: StaffOption | null;
	staff: StaffMember[];
};

export type TableData = Day;

export type UseGetDay = (P: { year: number; user?: string }) => {
	loading: boolean;
	days: Day[];
	refetch: ApolloRefetch;
};

export type DayData = {
	type: Day["type"];
	date: Day["date"];
	is_working_day: Day["is_working_day"];
	default_time: Day["default_time"];
	absence: Day["absence"];
	time?: Array<Day["time"] & { day_id?: string }> | null;
};

export type ColumnWorkingTimeProps = {
	type: DayData["type"];
	time: DayData["time"];
	date: string;
	refetch: ApolloRefetch;
	userId: string;
};
