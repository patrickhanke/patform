import { Updater } from "use-immer";
import { ApolloRefetch, ModuleField, Module } from "@repo/types";

export type ModuleFieldsPartial = ModuleField[];

export type AppModuleEditFieldsProps = {
	initialFields: ModuleFieldsPartial;
	moduleId: string;
	modulePath: Module["path"];
	refetch: ApolloRefetch;
	moduleName?: string;
};

export type AppModuleFieldProps = {
	field: ModuleField;
	changeField: (field: ModuleField) => void;
	modulePath: Module["path"];
};

export type AppModuleEditFieldProps = {
	field?: ModuleField;
	setFields: Updater<ModuleField[]>;
};
