import { Updater } from "use-immer";
import { Field, ApolloRefetch, ModuleField, Module } from "@repo/types";

export type ModuleFieldsPartial = ModuleField[];

export type AppModuleEditFieldsProps = {
	initialFields: ModuleFieldsPartial;
	moduleId: string;
	modulePath: Module["path"];
	refetch: ApolloRefetch;
};

export type AppModuleFieldProps = {
	field: ModuleField;
	changeField: (field: ModuleField) => void;
	modulePath: Module["path"];
};

export type AppModuleEditFieldProps = {
	field?: Field;
	setFields: Updater<Field[]>;
};
