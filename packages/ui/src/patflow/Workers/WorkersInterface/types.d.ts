import { WorkerTypes } from "@repo/types";

export type ChangeHandler = (type: "add" | "remove", ID: string) => void;

export type WorkersInterfaceComponent = {
	workers: WorkerTypes.Worker["objectId"][];
	onChange: ChangeHandler;
	nextDate?: string;
};

export type DisplayWorkerInterfaceComponent = {
	worker: WorkerTypes.Worker;
	isSelected: boolean;
	onChange: ChangeHandler;
	nextDate?: WorkersInterfaceComponent["nextDate"];
	showAvailability?: boolean;
};
