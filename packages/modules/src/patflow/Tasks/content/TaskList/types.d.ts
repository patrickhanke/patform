import { Task } from "@repo/types";
import { Dispatch, SetStateAction } from "react";

export type TaskListComponent = {
	taskList: Task[];
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
	filters?: Filter[];
	setFilters?: Dispatch<SetStateAction<Filter[]>>;
	filterColumns?: ModuleFilter[];
};

export type UseTaskColumnsProps = {
	pageState?: string;
};
