export type EditDayAbsenceProps = {
	date: string;
	time: WorkingTime;
	setTime: (t: AbsenceTime) => void;
	records: Record[];
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
	time: AbsenceTime
	updateHandler: (key: string, value: string | object[]) => void;
	defaultTime?: WorkingTime;
};
