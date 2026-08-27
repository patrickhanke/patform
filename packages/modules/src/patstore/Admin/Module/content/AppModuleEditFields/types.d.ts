import { Module, ModuleField } from "@repo/types";
import { type PageDataUpdateOptions } from "@repo/ui";

export type ModuleFieldsPartial = ModuleField[];

export type ModuleFieldsPageData = {
	fields: ModuleField[];
};

export type AppModuleEditFieldsProps = {
	objectId: string;
	initialFields: ModuleFieldsPartial;
	modulePath: Module["path"];
	updateOptions: PageDataUpdateOptions<ModuleFieldsPageData>;
};

export type AppModuleFieldProps = {
	field: ModuleField;
	changeField: (field: ModuleField) => void;
	modulePath: Module["path"];
};
