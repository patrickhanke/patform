import { DayDataTime } from "../StaffWorkingTimes";
import {
	AbsenceTime,
	ApolloRefetch,
	Day,
	DefaultWorkingDay,
	ErrorMessage,
	Record
} from "@repo/types";

export type WorkTimeEditorSession = {
	key: string;
	date: string;
	dayId?: string;
	initialTime?: Day["time"];
	times: DayDataTime[] | undefined;
	refetch: ApolloRefetch;
	records: Record[];
};

export type OpenWorkTimeEditor = (session: WorkTimeEditorSession) => void;

export type AbsenceEditorSession = {
	key: string;
	date: string;
	dayId?: string;
	absenceId?: string;
	times: DayDataTime[] | undefined;
	days?: Day[];
	records: Record[];
	workerId: string;
	refetch: ApolloRefetch;
};

export type OpenAbsenceEditor = (session: AbsenceEditorSession) => void;

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
	hasRecordForDate: boolean;
	onOpenWorkEditor: OpenWorkTimeEditor;
	onOpenAbsenceEditor: OpenAbsenceEditor;
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
