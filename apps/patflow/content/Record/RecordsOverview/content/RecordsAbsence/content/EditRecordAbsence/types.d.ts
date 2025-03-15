import { EditRecordAbsenceComponent } from "./types.d";
import { Absence, ApolloRefetch, Record } from "@types";
import { Dispatch, SetStateAction } from "react";

export type GetRecordObject = {
  loading: boolean;
  record: Record | null;
  refetch: ApolloRefetch;
};

export type CreateAbsenceComponent = {
  type: "create";
  refetch: ApolloRefetch;
  absence?: undefined;
  editAbsence: boolean;
  setEditAbsence: Dispatch<SetStateAction<boolean>>;
};

export type EditAbsenceComponent = {
  type: "edit";
  refetch: ApolloRefetch;
  absence: Absence;
  editAbsence: boolean;
  setEditAbsence: Dispatch<SetStateAction<boolean>>;
};

export type EditRecordAbsenceComponent =
  | EditAbsenceComponent
  | CreateAbsenceComponent;

export type EditAbsenceProps = {
  absence: Absence;
  record: Record;
  refetch: ApolloRefetch;
};

export type AbsenceWithRecordIs = Absence & {
  recordId: string;
};

export type FindRecordFunction = (recordIs: string) => Record;

export type RecordAbsenceProps = {
  records: Record[];
  refetch: ApolloRefetch;
  loading: boolean;
  filters: ApplicationTypes.Filter[];
  setFilters: Dispatch<SetStateAction<ApplicationTypes.Filter[]>>;
};

export type DeleteAbsenceProps = {
  deleteAbsence: boolean;
  setDeleteAbsence: Dispatch<SetStateAction<boolean>>;
  absence: Absence;
  record: Record;
  refetch: ApolloRefetch;
};

export type ChangeAbsenceStateProps = {
  absenceId: AbsenceWithRecordIs["id"];
  recordId: AbsenceWithRecordIs["recordId"];
  absenceState: AbsenceWithRecordIs["state"];
};

export type UseRecordAbsenceColumnsProps = {
  changeAbsenceState: (props: ChangeAbsenceStateProps) => void;
  findRecord: FindRecordFunction;
  refetch: ApolloRefetch;
};
