import { ColumnDef, PaginationState, Row } from "@tanstack/react-table";
import {
	ClassCategories,
	ModuleCategory,
	Module,
	EventClass,
	ClassState,
	ArticleClass,
	GroupClass,
	LocationClass,
	AppointmentClass,
	PageClass,
	PatstoreUser
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
	selectedRows?: string[];
	setSelectedRows?: Dispatch<SetStateAction<string[]>>;
	setOrder?: Dispatch<SetStateAction<string>>;
	filters?: Filter[];
	setFilters?: Dispatch<SetStateAction<Filter[]>>;
	filterColumns?: ColumnData<TData>[];
};

export type ColumnDef<TData> = ColumnDef<TData>;

export type TableColumnImageProps = {
	file?: string | File;
};

export type TableColumnImagesProps = {
	value?: string[] | string;
	onChange: (images: string[]) => Promise<void>;
	maxFileCount?: number;
};

export type TableColumnCategoryProps = {
	category: ModuleCategory;
	categories: ClassCategories;
	isEditable: boolean;
	onChange: (categories: string[]) => Promise<void>;
};

export type TableColumnStringProps = {
	value: string;
	isEditable?: boolean;
	isLink?: boolean;
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
	onChange?: (person: string) => Promise<void>;
};

export type TableColumnLocationProps = {
	value: string;
	isEditable?: boolean;
	onChange?: (location: string | null) => Promise<void>;
};

export type TableColumnDocumentsProps = {
	value: string[];
	isEditable?: boolean;
	onChange: (docs: string[]) => Promise<void>;
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
	| "edit_color"
	| "edit_content"
	| "date_picker"
	| "boolean"
	| "content"
	| "connected_elements"
	| "updated_by"
	| "created_by"
	| "edit_webpage_components"
	| "files"
	| "image_preview"
	| "user"
	| "edit_role"
	| "location"
	| "custom";

export type ColumnData<Class> = {
	id: keyof Class;
	label: string;
	type: ColumnDataTypes;
	disabled?: (a: Class) => boolean;
	enableSorting?: boolean;
	sortingFn?: (a: Row<Class>, b: Row<Class>) => number;
	render?: (row: Class) => ReactNode;
};

export type CreateColumnHookProps<Class> = {
	data: ColumnData<Class>[];
	categories: ModuleCategory[];
	className: string;
	fields?: Module["data_fields"];
	settings?: Module["setting_fields"];
	refetch: ApolloRefetch;
	constants?: { [key: string]: object };
	editLink?: string; // if muttiple links, use "link1/link2"
	disableCategory?: (row: Class, label: ModuleCategory["label"]) => boolean;
	useMasterKey?: boolean;
	editDisabled?: boolean;
	hasEmailSettings?: boolean;
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
	| AppointmentClass
	| PageClass;

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

export type UpdateColumnData = (t: {
	objectId: string;
	updateObject: {
		[key: string]:
			| object
			| string
			| number
			| string[]
			| boolean
			| null
			| undefined;
	};
	feedback: string;
}) => Promise<void>;

export type TableColumnUserProps = {
	value: PatstoreUser;
};
