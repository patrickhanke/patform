import { ApolloRefetch, Record, User } from "@repo/types";
import { Dispatch, SetStateAction } from "react";
import { ColumnDef } from "@tanstack/react-table";

export type StaffMemberTimesProps = {
  userId: string;
  timeSettings: User["time_settings"];
  createRecord: boolean;
  setCreateRecord: Dispatch<SetStateAction<boolean>>;
  projectId: string;
};

type TableColumnProps = {
  refetch: ApolloRefetch;
  projectId: string;
};

export type UseRecordTableColumns = (TableColumnProps) => ColumnDef<Record>[];
