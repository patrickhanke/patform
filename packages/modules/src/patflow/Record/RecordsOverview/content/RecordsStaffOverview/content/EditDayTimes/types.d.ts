import { DayDataTime } from "../StaffWorkingTimes";
import { WorkingTimes } from "./types";
import {
	AbsenceTime,
	ApolloRefetch,
	Day,
	DefaultWorkingDay,
	ErrorMessage
} from "@repo/types";

export type EditDayTimesProps = {
	type: "create" | "edit";
	date: string;
	days?: Day[];
	dayId?: string;
	initialTime?: Day["time"];
	times: DayDataTime[] | undefined;
	refetch: ApolloRefetch;
	userId: string;
	records: Record[];
	absenceId?: string;
	color?: string;
	label?: string;
	isWorkingDay: boolean;
};

export type EditTimeProps = {
	time: WorkingTime;
	timeChangeHandler: (t: Workingtime) => void;
	date: string;
	errors: ErrorMessage[];
};

export type WorkingTime = DefaultWorkingDay["time"];

export type WorkingTimes = Array<WorkingTime>;

export type UseErrors = (props: {
	date: string;
	time: WorkingTime | AbsenceTime | DayDataTime;
	times: DayDataTime[] | undefined;
	dayType: "absence" | "work";
	setErrors: React.Dispatch<React.SetStateAction<ErrorMessage[]>>;
	setDisabled: React.Dispatch<React.SetStateAction<[boolean, boolean]>>;
	records: Record[];
}) => void;
