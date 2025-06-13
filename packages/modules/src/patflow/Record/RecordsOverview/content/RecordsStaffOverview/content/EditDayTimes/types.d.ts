import { WorkingTimes } from "./types";
import { ApolloRefetch, DefaultWorkingDay } from "@repo/types";

export type EditDayTimesProps = {
	type: "create" | "edit";
	date: string;
	dayId?: string;
	initialTime?: WorkingTime;
	refetch: ApolloRefetch;
	userId: string;
};

export type EditTimeProps = {
	time: WorkingTime;
	timeChangeHandler: (t: Workingtime) => void;
	date: string;
};

export type WorkingTime = DefaultWorkingDay["time"];

export type WorkingTimes = Array<WorkingTime>;
