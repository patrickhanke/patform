import { FilterOperator } from "@repo/ui";
import { Field } from "@repo/types";
import { PatstoreProject } from "./Project";

export type ModulePath =
	| "/articles"
	| "/events"
	| "/groups"
	| "/locations"
	| "/people"
	| "/downloads"
	| "/forms"
	| "/entries"
	| "/categories"
	| "/images"
	| "/emails"
	| "/calendar"
	| "/website"
	| "/users"
	| "/videos";

export type ModuleFieldIds =
	| "title"
	| "createdAt"
	| "updatedAt"
	| "description"
	| "text"
	| "image"
	| "state"
	| "gallery"
	| "color"
	| "active"
	| "file"
	| "date"
	| "dates"
	| "times"
	| "link"
	| "documents"
	| "created_by"
	| "updated_by"
	| "location"
	| "connected_elements"
	| "author"
	| "team"
	| "persons"
	| "coordinates"
	| "address"
	| "email"
	| "label"
	| "pre_title"
	| "post_title"
	| "salutation"
	| "first_name"
	| "last_name"
	| "username"
	| "roles"
	| "emails"
	| "expires_at"
	| "video"
	| "name";

export type ModuleDataFieldsSpecific =
	| "team"
	| "author"
	| "location"
	| "coordinates"
	| "address"
	| "email"
	| "video";

export type ModuleCategory = {
	id: string;
	moduleId: string;
	label: string;
	key: string;
	connected_class: string;
	position: number;
	is_multi: boolean;
	category_ids: string[];
};

export type ModuleSettingsCategory = {
	id: string;
	label: string;
	value: string;
	position: number;
};

export type ModuleSettings = {
	[key: string]: unknown;
	categories?: ModuleSettingsCategory[];
};

export type ModuleFieldType =
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
	| "files"
	| "image_preview"
	| "user"
	| "edit_role"
	| "location"
	| "custom"
	| "emails"
	| "video";

export type ModuleField = {
	id: ModuleFieldIds;
	label: string;
	required: boolean;
	type: ModuleFieldType;
	active: boolean;
	position: number;
	default: boolean;
};

export type ModuleClass =
	| "Webpage"
	| "Article"
	| "Event"
	| "Entry"
	| "Category"
	| "Person"
	| "Image"
	| "Group"
	| "Download"
	| "Form"
	| "Email"
	| "Calendar"
	| "User"
	| "Video"
	| "Location"
	| "Dates"
	| "TrainingGroup";

export type ModuleSubMenuItem = {
	label: string;
	value: string;
	icon: string;
};

export type ModuleCommon = {
	objectId: string;
	name: string;
	icon: string;
	fields: ModuleField[];
	data_fields: Field[];
	setting_fields: Field[];
	position: number;
	project: PatstoreProject;
	categories: ModuleCategory[];
	settings: ModuleSettings;
	filters?: ModuleFilter[];
};

/** Path-specific defaults and connected_class for each module type */
export type ModulePathConfig = {
	"/website": {
		connected_class: "Webpage";
		default_fields: [];
		sub_menu: [
			{ label: "Inhalte"; value: "/content"; icon: "content" },
			{ label: "Seiten"; value: "/pages"; icon: "pages" },
			{ label: "Einstellungen"; value: "/settings"; icon: "settings" }
		];
	};
	"/articles": {
		connected_class: "Article";
		default_fields: ["title", "text", "image"];
		sub_menu: [];
	};
	"/events": {
		connected_class: "Event";
		default_fields: ["title", "dates"];
		sub_menu: [];
	};
	"/entries": {
		connected_class: "Entry";
		default_fields: ["title", "text"];
		sub_menu: [];
	};
	"/categories": {
		connected_class: "Category";
		default_fields: ["title"];
		sub_menu: [];
	};
	"/people": {
		connected_class: "Person";
		default_fields: ["title", "image"];
		sub_menu: [];
	};
	"/images": {
		connected_class: "Image";
		default_fields: ["title", "file"];
		sub_menu: [];
	};
	"/groups": {
		connected_class: "Group";
		default_fields: ["title"];
		sub_menu: [];
	};
	"/downloads": {
		connected_class: "Download";
		default_fields: ["title", "file"];
		sub_menu: [];
	};
	"/forms": {
		connected_class: "Form";
		default_fields: ["title", "text"];
		sub_menu: [];
	};
	"/users": {
		connected_class: "User";
		default_fields: [];
		sub_menu: [];
	};
	"/locations": {
		connected_class: "Location";
		default_fields: ["title"];
		sub_menu: [];
	};
	"/calendar": {
		connected_class: "Dates";
		default_fields: [];
		sub_menu: [];
	};
	"/emails": {
		connected_class: "Email";
		default_fields: [];
		sub_menu: [
			{ label: "E-Mails"; value: "/emails"; icon: "email" },
			{ label: "E-Mail-Vorlagen"; value: "/templates"; icon: "templates" }
		];
	};
	"/videos": {
		connected_class: "Video";
		default_fields: ["title", "video"];
		sub_menu: [];
	};
};

export type ModuleForPath<P extends ModulePath = ModulePath> = ModuleCommon & {
	path: P;
} & ModulePathConfig[P];

/** Discriminated union of all module variants, keyed by `path` */
export type Module = ModuleForPath;

/** Extract a single module variant by path */
export type ModuleByPath<P extends ModulePath> = ModuleForPath<P>;

/** Map each path to its Parse class name */
export type ModulePathToClass = {
	[P in ModulePath]: ModulePathConfig[P]["connected_class"];
};

export type ModuleFilterType =
	| "string"
	| "boolean"
	| "id"
	| "ids"
	| "search"
	| "exists"
	| "select"
	| "pointer";

export type ModuleFilter = {
	id: string;
	field: string;
	type: ModuleFilterType;
	operator: FilterOperator;
	label?: string;
	position?: number;
	value?: string | string[] | number | boolean | null | object;
	options?: {
		class_name?: string;
		search_path?: string;
		type?: "select" | "input" | "toggle";
		select_options?: { label: string; value: string }[];
		fixed?: boolean; // if true, the filter is a fixed filter and the user cannot change the operator, only the value (e.g. for select)
	};
};

/** Explicit path union - avoids keyof ModuleFilter which can be any due to Field/operator refs */
export type ModuleFilterPath =
	| "id"
	| "field"
	| "type"
	| "operator"
	| "label"
	| "position"
	| "options"
	| "options.class_name"
	| "options.search_path"
	| "options.type"
	| "options.fixed"
	| "options.select_options"
	| `options.select_options[${number}]`
	| `options.select_options[${number}].label`
	| `options.select_options[${number}].value`;
