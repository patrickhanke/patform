import { RowSelectionState, Updater, ColumnDef } from '@tanstack/react-table';

export type TableTypes = {
    data: TData[],
    columns: ColumnDef<TData>[],
    isSearchable?: boolean,
    selectChangeHandler?: (R: Updater<RowSelectionState>) => void,
    enableRowSelection?: boolean,
    title?: string,
    theadSpan?: number
}

export type ColumnDef<TData> = ColumnDef<TData>;

export type TableColumnImageProps = {
    url: string,
    isEditable: true,
    refetch: () => void
}