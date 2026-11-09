import { ApolloRefetch, Field, ModulePermission } from "@repo/types";
import { type PageDataUpdateOptions } from "@repo/ui";

export type ModuleDataFieldsPageData = {
	data_fields: Field[];
};

export type AppModuleEditFieldsProps = {
	objectId: string;
	initialFields: Field[];
	modulePermission?: ModulePermission;
	updateOptions: PageDataUpdateOptions<ModuleDataFieldsPageData>;
	refetch: ApolloRefetch;
};

export type AppModuleFieldProps = {
	field: Field;
	setActiveField: (id: string) => void;
	deleteField: (id: string) => void;
};

export type AppModuleEditFieldProps = {
	field: Field;
	onChange: (field: Field) => void;
	roles?: { objectId: string; label: string }[];
	modulePermission?: ModulePermission;
	onPermissionEditorOpenChange?: (isOpen: boolean) => void;
};
