import { Record } from "@repo/types";
import { months } from "@repo/provider";

export type StaffVacationProps = {
	days: Day[];
	month: (typeof months)[number];
	year: number;
	records: Record[];
};
