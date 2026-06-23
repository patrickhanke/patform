import {
	Absence,
	PatflowProject,
	PatflowUser,
	PatflowUserRoleTypes
} from "@repo/types";
import {
	Worker,
	Record,
	Surcharge,
	Holiday,
	Property,
	Task,
	Ticket
} from "@repo/types";

export type dynamicItem = {
	value: string;
	label: string;
};

export type RoleUsers = {
	[Property in PatflowUserRoleTypes]: PatflowUser["objectId"][];
};

export type ContextValues = {
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
	reloadAbsences: () => Promise<void>;
	reloadSurcharges: () => Promise<void>;
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

export type AbsenceDataStore = Absence & {
	value: string;
	label: string;
};

export type DataStoreState = {
	services: Taks[];
	holidays: HolidayDataStore[];
	absences: AbsenceDataStore[];
	workers: WorkerDataStore[];
	records: RecordDataStore[];
	properties: PropertyDataStore[];
	surcharges: SurchargeDataStore[];
	tasks: Task[];
	tickets: Ticket[];
	servicesUpdatedAt: number | null;
	holidaysUpdatedAt: number | null;
	absencesUpdatedAt: number | null;
	workersUpdatedAt: number | null;
	recordsUpdatedAt: number | null;
	propertiesUpdatedAt: number | null;
	surchargesUpdatedAt: number | null;
	tasksUpdatedAt: number | null;
	ticketsUpdatedAt: number | null;
	setServices: (services: Task[]) => void;
	setHolidays: (holidays: HolidayDataStore[]) => void;
	setWorkers: (workers: WorkerDataStore[]) => void;
	setRecords: (records: RecordDataStore[]) => void;
	setProperties: (properties: PropertyDataStore[]) => void;
	setSurcharges: (surcharges: SurchargeDataStore[]) => void;
	setTasks: (tasks: Task[]) => void;
	setTickets: (tickets: Ticket[]) => void;
	setAbsences: (absences: AbsenceDataStore[]) => void;
	getTasks: (
		filters: Filter[],
		skip: number,
		limit: number,
		propertyId?: string
	) => Task[];
	getTickets: (
		filters: Filter[],
		skip: number,
		limit: number,
		propertyId?: string
	) => Ticket[];
	getServices: (
		filters: Filter[],
		skip: number,
		limit: number,
		propertyId?: string
	) => Task[];
};
