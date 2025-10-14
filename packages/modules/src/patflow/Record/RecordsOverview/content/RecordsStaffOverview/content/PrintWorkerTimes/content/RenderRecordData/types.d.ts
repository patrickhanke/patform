import { Day, Record, Surcharge, Worker } from "@repo/types";

export type RenderRecordDataProps = {
	worker: Worker;
	days: Day[];
	year: number;
	month: number;
	records: Record[];
	surcharges: Surcharge[];
	fields: Array<(typeof table_fields)[number]["value"]>;
};

export type RenderDayData = (P: {
	year: number;
	month: number;
	days: Day[];
	records: Record[];
}) => DayData[];

export type DayData = {
	type: Day["type"];
	date: Day["date"];
	is_working_day: Day["is_working_day"];
	default_time: Day["default_time"];
	absence: Day["absence"];
	time?: Array<DayDataTime> | null;
	surcharges: Day["surcharges"];
};

export type DayDataTime = DayTime & { day_id?: string };
