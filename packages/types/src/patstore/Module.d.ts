import { FormField } from './../../../modules/src/patstore/Form/Form/content/FormFields/content/CreateField/types.d';
import { Module } from './Module.d';
import { Field } from "@repo/ui";
import { Project } from "./Classes";

export type ModulePath = "/articles" | "/events" | "/groups" | "/locations" | "/persons" | "/downloads" | "/forms" | "/entries" | "/categories" | "/images" | "/emails" | "/calendar" | "/website" | "/users";

export type ModuleFieldIds = "title" | "description" | "text" | "image" | "date" | "dates" | "gallery" | "color" | "data" | "content" | "file" | "documents" | "link" | "state" | "active" ;

export type ModuleDataFieldsSpecific = "team" | "author" | "location" | "coordinates" | "address" | "email" ;

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

export type  ModuleSettingsCategory = {
  id: string; 
  label: string; 
  value: string; 
  position: number
}

export type ModuleSettings = {
  [key: string]: any;
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
| "edit_webpage_components"
| "files"
| "image_preview"
| "user"
| "edit_role"
| "location"
| "custom";

export type ModuleField = {
	id: ModuleDataFields;
	label: string;
	required: boolean;
	type: ModuleFieldType;
	active: boolean;
	position: number;
	default: boolean;
};

export type Module = {
  objectId: string;
  name: string;
  path: ModulePath;
  icon: string;
  fields: ModuleField[];
  data_fields: Field[];
  setting_fields: Field[];
  position: number;
  project: Project;
  connected_class: string;
  categories: ModuleCategory[];
  settings: ModuleSettings;
  default_fields: ModuleFieldIds[];
  sub_menu: {
    label: string;
    value: string;
    icon: string;
  }[];
  filters?: ModuleFilter[];
};

export type ModuleFilterType = "string" | "boolean" | "id" | "ids" | "search" | "exists" | "select" | "pointer";

export type ModuleFilter = {
  id: string;
  field: string;
  type: ModuleFilterType;
  operator: equalTo | notEqualTo | in | notIn | contains | containedIn | containedBy | matchesRegex | exists | have | haveNot | lessThan | lessThanOrEqualTo | greaterThan | greaterThanOrEqualTo | search;
  label?: string;
  position?: number;
  options?: {
    class_name?: string;
    search_path?: string;
    type?: Field["type"];
    select_options?: { label: string; value: string }[];
    fixed?: boolean;
  }
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
