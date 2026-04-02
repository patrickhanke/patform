import { ApolloRefetch } from "@repo/types";

export type TaskSlideInProps = {
	task: Task;
	isEditable?: boolean;
	refetchTasks: ApolloRefetch;
};
