import { RowSelectionState, Updater, ColumnDef } from '@tanstack/react-table';
import { ClassCategories, ModuleCategory, Module, EventClass, ClassState, PersonPointer } from '@repo/types';
import { CategoryClass, ImageClass, NewsClass, PersonClass } from '@repo/types'; 
import { MapPlace } from '../Map';


export type TableTypes = {
    data: TData[],
    columns: ColumnDef<TData>[],
    isSearchable?: boolean,
    selectChangeHandler?: (R: Updater<RowSelectionState>) => void,
    enableRowSelection?: boolean,
    title?: string,
    theadSpan?: number,
    rowStyles?: (row: TData[number]) => React.StyleHTMLAttributes
}

export type ColumnDef<TData> = ColumnDef<TData>;

export type TableColumnImageProps = {
    url?: string,
    isEditable?: boolean,
    onChange: (image: string) => void,
    maxFileCount?: number
}

export type TableColumnGalleryProps = {
    value?: string[],
    onChange: (images: string[]) => Promise<void>,
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

export type TableColumnGeopointProps = {
    value: MapPlace,
    isEditable?: boolean,
    onChange: (place: MapPlace) => void
}

export type TableColumnEditStateProps = {
    value: string,
    isEditable?: boolean,
    onChange: (state: ClassState) => Promise<void>,
    options: ClassState[]
}

type PersonOption = { value: string, label: string, person: PersonClass };

export type TableColumnPersonProps = {
    value: PersonClass,
    isEditable?: boolean,
    onChange: (person: string) => Promise<void>,
}

export type TableColumnPersonsProps = {
    value: string[],
    isEditable?: boolean,
    onChange: (person: string[]) => Promise<void>,
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
    'geopoint' |
    'edit_geopoint' |
    'date' |
    'edit_date' |
    'state' |
    'edit_state' |
    'gallery' |
    'person' |
    'edit_person' |
    'edit_persons' |
    'edit_times' |
    'file' |
    'files'

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
    constants?: {[key: string]: any},
    editLink?: string
};

export type ColumnClasses = ImageClass | NewsClass | PersonClass | CategoryClass | EventClass

export type UseCreateColumnsHook<Class> = (params: CreateColumnHookProps<Class>) => ColumnDef<Class>[];