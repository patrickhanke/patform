import { ApolloRefetch, Record, Worker } from "@repo/types";
import { Dispatch, SetStateAction } from "react";
import { ColumnDef } from "@tanstack/react-table";

export type EditRecordsProps = {
	createRecord: boolean;
	setCreateRecord: Dispatch<SetStateAction<boolean>>;
	projectId: string;
};

type TableColumnProps = {
	refetch: ApolloRefetch;
	projectId: string;
};

export type SelectUserProps = {
	selectedUser?: Worker;
	setSelectedUser: (worker: Worker) => void;
};

export type SelectUser = {
	value: string;
	label: string;
	user: Worker;
	element: JSX.Element;
};

export type UseRecordTableColumns = (TableColumnProps) => ColumnDef<Record>[];
