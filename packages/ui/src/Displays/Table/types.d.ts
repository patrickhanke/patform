import { RowSelectionState, Updater, ColumnDef } from '@tanstack/react-table';
import { Categories, ClassCategories, ModuleCategory } from '@repo/types';

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
    isEditable?: boolean,
    onChange: (image: string) => void,
    maxFileCount?: number
}

export type TableColumnCategoryProps = {
    category: ModuleCategory,
    objectId: string,
    className: string,
    categories: ClassCategories
}

export type TableColumnStringProps = {
    value: string,
    isEditable?: boolean,
    onChange: (image: string) => void
}

export type TableColumnTextfieldProps = {
    value: string,
    isEditable?: boolean,
    onChange: (image: string) => void
}

export type ColumnDataTypes = 'string' | 'edit_string' | 'image' | 'category' | 'textfield' | 'edit_image' | 'edit_textfield';

export type ColumnData<T> = {
    id: keyof T,
    label: string,
    type: ColumnDataTypes
}

export type CreateColumnHookProps<T> = {
    data: Array<ColumnData<T>>;
    categories: ModuleCategory[];
    className: string;
    objectId: string;
    refetch: () => void;
};

export type UseCreateColumnsHook = <T>(params: CreateColumnHookProps<T>) => ColumnDef<T>[];