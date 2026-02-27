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

export type ModuleField = {
	id: ModuleDataFields;
	label: string;
  name: string;
	required: boolean;
	type: string;
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

export type ModuleFilter = {
  id: string;
  field: string;
  type: string;
  operator: template | equalTo | notEqualTo | in | notIn | contains | containedIn | containedBy | matchesRegex | exists | have | haveNot | lessThan | lessThanOrEqualTo | greaterThan | greaterThanOrEqualTo;
  operatorTemplate?: string;
  label?: string;
  position?: number;
};
