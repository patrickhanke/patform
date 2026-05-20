import { Absence, AbsenceTime, Day, Record, WorkingTime } from "@repo/types";
import { Dispatch, SetStateAction } from "react";

export type EditDayAbsenceProps = {
	type: "edit" | "create";
	dayId?: string;
	absenceId?: string;
	date: string;
	records: Record[];
	workerId: string;
	year: number;
	isOpen: boolean;
	setIsOpen: Dispatch<SetStateAction<boolean>>;
	times: DayDataTime[] | undefined;
	days?: Day[];
	refetch: ApolloRefetch;
};

export type AddEditVacationProps = {
	date: string;
	records: Record[];
};

export type AddEditPayedAbsenceProps = {
	time: AbsenceTime;
	date: string;
	timeChangeHandler: (t: AbsenceTime) => void;
};

export type AddEditDaySickProps = {
	time: AbsenceTime;
	date: string;
	timeChangeHandler: (t: AbsenceTime) => void;
};

export type AddEditCompensationTimesProps = {
	time: AbsenceTime;
	date: string;
	timeChangeHandler: (t: AbsenceTime) => void;
	defaultTime?: WorkingTime;
};

export type AddEditBreakProps = {
	time: AbsenceTime;
	updateHandler: (key: string, value: string | object[]) => void;
	defaultTime?: WorkingTime;
};

export type InitialAbsence = Omit<Absence, "user"> & {
	user?: UserDisplayData | undefined;
};

export type AbsenceDayProps = {
	days: IntervalDay[];
	overlap: string[];
};

export type UseAbsenceDaysHook = (T: { absence: InitialAbsence }) => {
	daysLoading: boolean;
	intervalDays: IntervalDay[];
	daysData: Day[] | undefined;
};

export type IntervalDay = {
	date: string;
	state?: "create" | "delete" | "change" | "keep";
	overlap?: boolean;
	objectId?: string;
};

export type UseErrors = (props: {
	date: string;
	dayId?: string;
	dayType: "absence" | "work";
	absence: InitialAbsence;
	days: Day[] | undefined;
	setErrors: React.Dispatch<React.SetStateAction<ErrorMessage[]>>;
	setOverlap: React.Dispatch<React.SetStateAction<string[]>>;
	records: Record[];
	isFull: boolean;
}) => void;

export type CreateTimesFromAbsence = (
	start: string,
	end: string,
	date: string,
	records: Record[],
	times: DayDataTime[] | undefined,
	timeId?: string
) => WorkingTime;
