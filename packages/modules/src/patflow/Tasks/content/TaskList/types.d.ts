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
	enableRowSelection?: boolean;
	selectedRows?: string[];
	setSelectedRows?: Dispatch<SetStateAction<string[]>>;
};

export type UseTaskColumnsProps = {
	refetch: ApolloRefetch;
	pageState?: string;
};
