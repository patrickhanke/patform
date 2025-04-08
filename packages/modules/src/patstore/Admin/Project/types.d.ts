import { Module } from "@repo/types";
import { Dispatch, SetStateAction } from "react";
import { module_option_fields } from "./constants/module_option_fields";

export type SelectModule = {
	value: keyof typeof module_option_fields;
	label: string;
	fields: module_option_fields[keyof typeof module_option_fields];
	disabled: boolean;
};

export type CreateModuleProps = {
	createModule: boolean;
	setCreateModule: Dispatch<SetStateAction<boolean>>;
	createModuleHandler: (T: SelectModule["fields"]) => Promise<void>;
	modules: Module[];
};

export type ModuleOptionsKeys =
	| "/website"
	| "/persons"
	| "/website"
	| "/articles"
	| "/events"
	| "/news"
	| "/categories"
	| "/images"
	| "/training-group"
	| "/downloads"
	| "/users"
	| "/forms"
	| "/groups"
	| "/locations"
	| "/calendar";

export type ModuleOptionsField = {
	[key in ModuleOptionsKeys]: Omit<Module, "objectId" | "project">;
};

export type ModuleOptionsFields = {
	[key in ModuleOptionsKeys]: module_option_fields[key];
};
