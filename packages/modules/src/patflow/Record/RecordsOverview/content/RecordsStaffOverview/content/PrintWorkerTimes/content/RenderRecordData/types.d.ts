import { Day, Worker } from "@repo/types";

export type RenderRecordDataProps = {
	workers: Worker[];
	days: Day[];
	year: number;
	month: number;
};

export type RenderDayData = (P: {
	year: number;
	month: number;
	days: Day[];
	records: Record[];
}) => DayData[];
