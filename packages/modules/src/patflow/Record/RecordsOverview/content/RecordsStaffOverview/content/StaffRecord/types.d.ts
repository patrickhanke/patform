import { months } from "@repo/provider";
import { StaffMember } from "@repo/types";
import { SelectElement } from "@repo/ui";
import { Dispatch, SetStateAction } from "react";

export type SelectStaffProps = {
	staff: StaffMember[];
	selectedWorker: SelectElement[];
	setSelectedWorker: Dispatch<SetStateAction<SelectElement[]>>;
};

export type StaffRecordProps = {
	days: RecordData;
	year: number;
	staff: StaffMember[];
};

export type MonthData = {
	month: string;
	monthSaldo: string;
	target: string;
	monthTimes: string;
};
