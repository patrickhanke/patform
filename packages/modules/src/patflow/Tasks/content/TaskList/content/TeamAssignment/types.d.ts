import { Task } from "@repo/types";
import { ReactNode } from "react";

export type TeamAssignmentProps = {
	task: Task;
	showAsButton?: boolean;
	isEditable?: boolean;
};

export type DisplayWorkerProps = {
	task: Task;
	showAsButton?: boolean;
	selectWorkers?: boolean;
	propertyId?: string;
};

export type WorkerOption = {
	value: string;
	id: string;
	label: string;
	element: ReactNode;
};
