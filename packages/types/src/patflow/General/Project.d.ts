import { ColorValues } from "@repo/ui";

export type PatflowProject = {
	objectId: string;
	logo: {
		url: string;
		name: string;
	};
	name: string;
	path: string;
	settings: {
		time_settings?: TimeSettings;
		record_settings?: RecordSettings;
	};
};

export type SurchargeTypes = "time" | "day" | "overtime" | "work";

export type SurchargeData = {
	kind: "surcharge";
	type: SurchargeTypes;
	time_value: { start: string; end: string };
	day_value: string[];
	work_value: object;
	value: number;
	active: boolean;
	start_date: string;
	end_date: string | null;
	color: ColorValues;
	short: string;
};

export type Surcharge = {
	objectId: string;
	createdAt?: string;
	updatedAt?: string;
	former_id?: string;
	title: string;
	label: string;
	date: string;
	description: string;
	reference_id: "surcharge";
	data: SurchargeData;
};

export type RecordSettings = {
	surcharges: Surcharge[];
};

export type TimeSettings = {
	holidays: Holiday[];
};

export type Holiday = {
	updatedAt: string;
	date: string;
	name: string;
	comment: string;
	objectId: string;
	project: PatflowProject;
	dates: string[];
	former_id?: string;
};
