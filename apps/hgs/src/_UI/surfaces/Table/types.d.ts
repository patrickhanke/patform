import { RowSelectionState, Updater } from '@tanstack/react-table';

export type TableTypes = {
    data: TData[],
    columns: ColumnDef<TData>[],
    rowStyles?: (row: TData[number]) => React.StyleHTMLAttributes
    isSearchable?: boolean,
    selectChangeHandler?: (R: Updater<RowSelectionState>) => void,
    enableRowSelection?: boolean,
    title?: string,
    theadSpan?: number
}