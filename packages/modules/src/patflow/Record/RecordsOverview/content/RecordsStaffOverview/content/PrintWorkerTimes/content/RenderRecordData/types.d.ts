import { Day, Record, Surcharge, Worker } from "@repo/types";
import table_fields from "../../constants/table_fields";

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

export type DayDataTime = {
	saldo: number;
	time: NonNullable<Day["time"]>;
	day_id?: string;
	absence?: Day["absence"];
	type?: Day["type"];
	worktime: number;
};

export type DayData = {
	date: Day["date"];
	is_working_day: Day["is_working_day"];
	default_time: Day["default_time"];
	times: DayDataTime[];
	surcharges: Day["surcharges"];
	comment?: Day["comment"];
	absence?: Day["absence"];
	type?: Day["type"];
};
