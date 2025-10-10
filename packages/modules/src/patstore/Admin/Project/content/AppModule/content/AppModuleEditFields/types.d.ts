import { Updater } from "use-immer";
import { Field, ApolloRefetch } from "@repo/types";

export type ModuleFieldsPartial = ModuleField[];

export type AppModuleEditFieldsProps = {
	initialFields: ModuleFieldsPartial;
	moduleId: string;
	modulePath: string;
	refetch: ApolloRefetch;
};

export type AppModuleFieldProps = {
	field: ModuleField;
	changeField: (field: ModuleField) => void;
};

export type AppModuleEditFieldProps = {
	field?: Field;
	setFields: Updater<Field[]>;
};
