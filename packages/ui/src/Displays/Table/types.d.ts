import { RowSelectionState, Updater, ColumnDef } from '@tanstack/react-table';
import { ClassCategories, ModuleCategory, Module, EventClass } from '@repo/types';
import { CategoryClass, ImageClass, NewsClass, PersonClass } from '@repo/types'; 


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
    url?: string,
    isEditable?: boolean,
    onChange: (image: string) => void,
    maxFileCount?: number
}

export type TableColumnCategoryProps = {
    category: ModuleCategory,
    objectId: string,
    className: string,
    categories: ClassCategories,
    refetch: () => void
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

export type ColumnDataTypes = 
    'string' | 
    'edit_string' | 
    'image' | 
    'category' | 
    'textfield' | 
    'edit_image' | 
    'edit_textfield' | 
    'edit_dates' |
    'edit_texteditor' |
    'texteditor' |
    'date';

export type ColumnData<Class> = {
    id: keyof Class,
    label: string,
    type: ColumnDataTypes
}

export type CreateColumnHookProps<Class> = {
    data: Array<ColumnData<Class>>;
    categories: ModuleCategory[];
    className: string;
    fields?: Module['fields']
    refetch: () => void;
};

export type ColumnClasses = ImageClass | NewsClass | PersonClass | CategoryClass | EventClass

export type UseCreateColumnsHook<Class> = (params: CreateColumnHookProps<Class>) => ColumnDef<Class>[];