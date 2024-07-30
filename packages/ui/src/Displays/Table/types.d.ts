import { RowSelectionState, Updater, ColumnDef } from '@tanstack/react-table';
import { ModuleCategory } from '@repo/types';

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
    isEditable?: true,
    onChange: (image: string) => void,
    maxFileCount?: number
}

export type TableColumnCategoryProps = {
    category: ModuleCategory,
    onChange: (category: string) => void,
}

export type TableColumnStringProps = {
    value: string,
    isEditable?: true,
    onChange: (image: string) => void
}