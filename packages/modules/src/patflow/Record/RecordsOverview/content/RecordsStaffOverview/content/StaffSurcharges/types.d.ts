import { Day } from "@repo/types";

export type StaffSurchargesProps = {
	days: Day[];
	month: (typeof months)[number];
	year: number;
	projectId: string;
};
