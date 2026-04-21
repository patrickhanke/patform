import { Task } from "@repo/types";

export type TaskSlideInProps = {
	task: Task;
	isEditable?: boolean;
	isService?: boolean;
};
