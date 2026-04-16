import { ApolloRefetch } from "@repo/types";
import { ColumnDef } from "@tanstack/react-table";
import { Service } from "@repo/types";

export type UpdateHandler = (T: {
	serviceId: string;
	updateObject: { [key: string]: any };
}) => void;

export type UseServiceSettingsTableColumns = (T: {
	updateHandler: UpdateHandler;
}) => ColumnDef<Service>[];

export type CreateServiceProps = {
	createService: ServiceSettingsProps["createService"];
	setCreateService: ServiceSettingsProps["setCreateService"];
	refetch: ApolloRefetch;
};

export type ServicePropertiesColumnProps = {
	properties: string[];
	onChange: (properties: string[]) => Promise<void>;
};