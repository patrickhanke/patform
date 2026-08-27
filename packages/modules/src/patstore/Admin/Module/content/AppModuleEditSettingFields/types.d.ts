import { Updater } from "use-immer";
import { Field } from "@repo/ui";

export type AppModuleEditFieldsProps = {
	initialFields: Field[];
	moduleId: string;
};

export type AppModuleFieldProps = {
	field: Field;
	setActiveField: (C: string) => void;
	deleteField: (id: string) => void;
};

export type AppModuleEditFieldProps = {
	field?: Field;
	setFields: Updater<Field[]>;
};
