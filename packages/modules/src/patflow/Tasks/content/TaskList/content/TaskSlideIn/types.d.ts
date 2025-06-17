import { ApolloRefetch } from "@repo/types";

export type TaskSlideInProps = {
	title: string;
	taskId: string;
	isEditable?: boolean;
	refetchTasks: ApolloRefetch;
};
