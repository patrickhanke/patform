import { ApolloRefetch, Task } from "@repo/types";
import { ReactNode } from "react";

export type TeamAssignmentProps = {
	task: Task;
	refetch: ApolloRefetch;
	showAsButton?: boolean;
	isEditable?: boolean;
};

export type DisplayWorkerProps = {
	task: Task;
	refetch: ApolloRefetch;
	showAsButton?: boolean;
	selectWorkers?: boolean;
};

export type WorkerOption = {
	value: string;
	id: string;
	label: string;
	element: ReactNode;
};
