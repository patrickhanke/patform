import { ApolloRefetch, Record, User, Worker } from "@types";
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
  setSelectedUser: (workers: SelectUser[]) => void;
};

export type SelectUser = {
  value: string;
  label: string;
  user: Worker;
  element: JSX.Element;
};

export type UseRecordTableColumns = (TableColumnProps) => ColumnDef<Record>[];
