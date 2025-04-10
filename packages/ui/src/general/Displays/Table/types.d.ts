import { ColumnDef, PaginationState } from "@tanstack/react-table";
import {
	ClassCategories,
	ModuleCategory,
	Module,
	EventClass,
	ClassState,
	ArticleClass,
	GroupClass,
	LocationClass,
	DateClass
} from "@repo/types";
import { CategoryClass, ImageClass, NewsClass, PersonClass } from "@repo/types";
import { Dispatch, ReactNode, SetStateAction } from "react";
import { LatitudeLongitude } from "../Map";
import { ColorValues } from "@repo/ui";

export type TableTypes = {
	data: TData[];
	columns: ColumnDef<TData>[];
	rowStyles?: (row: TData[number]) => React.StyleHTMLAttributes;
	cellBorders?: boolean;
	enableRowSelection?: boolean;
	onRowSelection?: (rowSelection: string[]) => void;
	rowCount?: number;
	pagination?: PaginationState;
	setPagination?: Dispatch<SetStateAction<PaginationState>>;
	filterContent?: ReactNode;
};

export type ColumnDef<TData> = ColumnDef<TData>;

export type TableColumnImageProps = {
	url?: string;
	isEditable?: boolean;
	onChange: (image: string) => void;
	maxFileCount?: number;
};

export type TableColumnGalleryProps = {
	value?: string[];
	onChange: (images: string[]) => Promise<void>;
	maxFileCount?: number;
};

export type TableColumnCategoryProps = {
	category: ModuleCategory;
	categories: ClassCategories;
	onChange: (categories: string[]) => Promise<void>;
};

export type TableColumnStringProps = {
	value: string;
	isEditable?: boolean;
	onChange: (image: string) => void;
};

export type TableColumnTextfieldProps = {
	value: string;
	isEditable?: boolean;
	onChange: (image: string) => void;
};

export type TableColumnGeopointProps = {
	value: LatitudeLongitude;
	isEditable?: boolean;
	onChange: (place: MapPlace) => void;
};

export type TableColumnEditStateProps = {
	value: string;
	isEditable?: boolean;
	onChange: (state: ClassState) => Promise<void>;
	options: ClassState[];
};

type PersonOption = { value: string; label: string; person: PersonClass };

export type TableColumnPersonProps = {
	value: PersonClass;
	isEditable?: boolean;
	onChange: (person: string) => Promise<void>;
};

export type TableColumnPersonsProps = {
	value: string[];
	isEditable?: boolean;
	onChange: (person: string[]) => Promise<void>;
};

export type ColumnDataTypes =
	| "string"
	| "edit_string"
	| "image"
	| "category"
	| "textfield"
	| "edit_image"
	| "edit_textfield"
	| "edit_dates"
	| "edit_texteditor"
	| "texteditor"
	| "geopoint"
	| "edit_geopoint"
	| "date"
	| "edit_date"
	| "state"
	| "edit_state"
	| "gallery"
	| "person"
	| "edit_person"
	| "edit_persons"
	| "edit_times"
	| "file"
	| "edit_team"
	| "files"
	| "edit_color";

export type ColumnData<Class> = {
	id: keyof Class;
	label: string;
	type: ColumnDataTypes;
	enableSorting?: boolean;
	sortingFn?: (a: Class, b: Class) => number;
};

export type CreateColumnHookProps<Class> = {
	data: Array<ColumnData<Class>>;
	categories: ModuleCategory[];
	className: string;
	fields?: Module["fields"];
	refetch: () => void;
	constants?: { [key: string]: object };
	editLink?: string;
};

export type ColumnClasses =
	| ImageClass
	| NewsClass
	| PersonClass
	| CategoryClass
	| EventClass
	| ArticleClass
	| GroupClass
	| LocationClass
	| DateClass;

export type UseCreateColumnsHook<Class> = (
	params: CreateColumnHookProps<Class>
) => ColumnDef<Class>[];

export type PaginationState = {
	pageIndex: number;
	pageSize: number;
};

export type TableColumnEditColorProps = {
	value: ColorValues;
	onChange: (color: string) => void;
};
