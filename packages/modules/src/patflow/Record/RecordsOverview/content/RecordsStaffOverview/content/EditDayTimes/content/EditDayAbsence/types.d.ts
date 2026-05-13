import { Absence, AbsenceTime, Day, WorkingTime } from "@repo/types";
import { Dispatch, SetStateAction } from "react";

export type EditDayAbsenceProps = {
	type: "edit" | "create";
	absenceId?: string;
	date: string;
	records: Record[];
	workerId: string;
	year: number;
	isOpen: boolean;
	setIsOpen: Dispatch<SetStateAction<boolean>>;
	times: DayDataTime[] | undefined;
	days?: Day[];
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
};

export type IntervalDay = {
	date: string;
	state?: "create" | "delete" | "change" | "keep";
	overlap?: boolean;
};

export type UseErrors = (props: {
	date: string;
	dayType: "absence" | "work";
	absence: InitialAbsence;
	days: Day[] | undefined;
	setErrors: React.Dispatch<React.SetStateAction<ErrorMessage[]>>;
	setOverlap: React.Dispatch<React.SetStateAction<string[]>>;
	records: Record[];
	isFull: boolean;
}) => void;
