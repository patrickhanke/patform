import { Absence, ApolloRefetch, Record } from '@types';
import { Dispatch, SetStateAction } from 'react';

export type GetRecordObject = {
    loading: boolean;
    record: Record | null;
    refetch: ApolloRefetch;
  };

export type CreateAbsenceComponent = {
    refetch: ApolloRefetch, 
    year: nummber,
    records: Record[],
    editAbsence: boolean, 
    setEditAbsence: Dispatch<SetStateAction<boolean>>,
    initialData?: Absence
}

export type EditAbsenceProps = {
    absence: Absence,
    refetch: ApolloRefetch, 
}

export type AbsenceWithRecordIs = Absence & {
    recordId: string
}

export type FindRecordFunction = (recordIs: string) => Record;

export type RecordAbsenceProps = {
    records: Record[],
    refetch: ApolloRefetch,
    loading: boolean,
    filters: ApplicationTypes.Filter[],
    setFilters: Dispatch<SetStateAction<ApplicationTypes.Filter[]>>;
}

export type DeleteAbsenceProps = {
    deleteAbsence: boolean; 
    setDeleteAbsence: Dispatch<SetStateAction<boolean>>;
    absence: Absence; 
    refetch: ApolloRefetch;
}

export type ChangeAbsenceStateProps = {
    absenceId: AbsenceWithRecordIs['id'], 
    recordId: AbsenceWithRecordIs['recordId'], 
    absenceState: AbsenceWithRecordIs['state']
}

export type UseRecordAbsenceColumnsProps = {
    refetch: ApolloRefetch;
}