import { ApolloRefetch, Task } from "@repo/types";
import { Dispatch, SetStateAction } from "react";

export type TaskListComponent = {
	taskList: Task[];
	refetch: ApolloRefetch;
	pageState?: string;
	pagination?: {
		pageIndex: number;
		pageSize: number;
	};
	setPagination?: Dispatch<
		SetStateAction<{
			pageIndex: number;
			pageSize: number;
		}>
	>;
	count?: number;
	filterContent?: React.ReactNode;
};

export type UseTaskColumnsProps = {
	refetch: ApolloRefetch;
	setArchiveModal: Dispatch<SetStateAction<Task | undefined>>;
	setDeleteTaskModal: Dispatch<SetStateAction<Task | undefined>>;
	pageState?: string;
};
