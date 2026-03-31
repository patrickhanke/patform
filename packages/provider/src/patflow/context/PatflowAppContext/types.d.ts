import { PatflowProject, PatflowUser, PatflowUserRoleTypes } from "@repo/types";
import { Dispatch } from "react";
import { Worker, Record, Surcharge, Holiday, Property } from "@repo/types";

export type dynamicItem = {
	value: string;
	label: string;
};

export type RoleUsers = {
	[Property in PatflowUserRoleTypes]: PatflowUser["objectId"][];
};

export type ContextValues = {
	refetchTicket: Date | undefined;
	refetchTask?: Date | undefined;
	setRefetchTicket: Dispatch<SetStateAction<Date | undefined>>;
	setRefetchTask: Dispatch<SetStateAction<Date | undefined>>;
	createTicket: JSX.Element;
	createTask: JSX.Element;
	selectYear: JSX.Element;
	year: number;
	refetchWorkers: () => void;
	refetchProperties: () => void;
	reloadHolidays: () => Promise<void>;
	reloadWorkers: () => Promise<void>;
	reloadRecords: () => Promise<void>;
	reloadProperties: () => Promise<void>;
	roles: {
		value: string;
		type: string;
		label: string;
		color: string;
		users: { objectId: string; username: string }[];
	}[];
	project: PatflowProject;
	roleUsers: RoleUsers;
};

export type YearOptions = { value: number; label: string }[];

export type SelectYearProps = {
	year: number;
	setYear: (value: number) => void;
};

export type PropertyDataStore = Property & {
	value: string;
	label: string;
};

export type WorkerDataStore = Worker & {
	value: string;
	label: string;
};

export type RecordDataStore = Record & {
	value: string;
	label: string;
};

export type SurchargeDataStore = Surcharge & {
	value: string;
	label: string;
};

export type HolidayDataStore = Holiday & {
	value: string;
	label: string;
};

export type DataStoreState = {
	holidays: HolidayDataStore[];
	workers: WorkerDataStore[];
	records: RecordDataStore[];
	properties: PropertyDataStore[];
	surcharges: SurchargeDataStore[];
	setHolidays: (holidays: HolidayDataStore[]) => void;
	setWorkers: (workers: WorkerDataStore[]) => void;
	setRecords: (records: RecordDataStore[]) => void;
	setProperties: (properties: PropertyDataStore[]) => void;
	setSurcharges: (surcharges: SurchargeDataStore[]) => void;
};
