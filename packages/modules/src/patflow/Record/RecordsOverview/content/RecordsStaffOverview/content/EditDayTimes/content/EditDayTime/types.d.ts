export type EditTimeProps = {
	time: WorkingTime;
	timeChangeHandler: (t: Workingtime) => void;
	date: string;
	errors: ErrorMessage[];
};

export type WorkingTime = DefaultWorkingDay["time"];