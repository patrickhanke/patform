import { AbsenceTypes, Day, Record } from "@repo/types";
import { User } from "@/types/General/User";
import { WorkerDataStore } from "@repo/provider";

export type GetRecordObject = {
	loading: boolean;
	absences: AbsenceTypes.Absence[];
	refetch: () => void;
};

export type WeekObject = {
	record: Record;
	user: User;
	state: "submitted" | "approved" | "rejected";
	working_days: number;
	holidays: number;
	absence: number;
	vacation: number;
	time: number;
	breaks: number;
	dayKeys: string[];
};

export type DateMonthRecord = WeekObject;

export type RecordsCalendarProps = {
	records: Record[];
};

export type DayState = "open" | "completed" | "vacation" | "sick" | "holiday";

export interface WorkerRowProps {
	worker: WorkerDataStore;
	interval: Date[];
	days: Day[];
}

export interface MonthlyCalendarGridProps {
	workers: WorkerDataStore[];
	month: Date;
	days: Day[];
}
