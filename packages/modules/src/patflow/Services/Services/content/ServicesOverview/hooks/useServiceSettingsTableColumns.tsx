import { StatelessToggle, TableColumnTextfield } from "@repo/ui";
import { ColumnDef } from "@tanstack/react-table";
import { Service } from "@repo/types";
import { useMemo } from "react";
import { UseServiceSettingsTableColumns } from "../types";
import ServicePropertiesColumn from "../components/ServicePropertiesColumn";

const useServiceSettingsTableColumns: UseServiceSettingsTableColumns = ({
	updateHandler
}) => {
	const columns: ColumnDef<Service>[] = useMemo(
		() => [
			{
				accessorKey: "name",
				header: () => <span>Name</span>,
				if: "name",
				cell: (info) => info.getValue(),
				footer: (info) => info.column.id,
				sortingFn: "alphanumeric",
				meta: {
					exportLabel: "Name"
				}
			},
			{
				accessorFn: (row) => (
					<TableColumnTextfield
						value={row.description}
						isEditable={true}
						onChange={(value) =>
							updateHandler({
								serviceId: row.objectId,
								updateObject: { description: value }
							})
						}
					/>
				),
				header: () => <span>Beschreibung</span>,
				id: "description",
				cell: (info) => info.getValue(),
				footer: (info) => info.column.id,
				sortingFn: "alphanumeric",
				meta: {
					exportValue: (row: Service) => row.description ?? ""
				}
			},
			{
				accessorFn: (row) => (
					<ServicePropertiesColumn
						properties={row.properties}
						onChange={async (value: string[]) => {
							updateHandler({
								serviceId: row.objectId,
								updateObject: {
									properties: value
								}
							});
						}}
					/>
				),
				header: () => <span>Objekte</span>,
				id: "properties",
				cell: (info) => info.getValue(),
				footer: (info) => info.column.id,
				sortingFn: "alphanumeric",
				meta: {
					exportLabel: "Objekte",
					exportValue: (row: Service) =>
						Array.isArray(row.properties)
							? row.properties.join(", ")
							: ""
				}
			},
			{
				accessorFn: (row) => (
					<StatelessToggle
						value={row.is_active}
						onChange={(value: boolean) =>
							updateHandler({
								serviceId: row.objectId,
								updateObject: { is_active: value }
							})
						}
					/>
				),
				header: () => <span>Aktiv</span>,
				id: "is_active",
				cell: (info) => info.getValue(),
				footer: (info) => info.column.id,
				sortingFn: "alphanumeric",
				meta: {
					exportLabel: "Aktiv",
					exportValue: (row: Service) =>
						row.is_active ? "Aktiv" : "Inaktiv"
				}
			}
		],
		[]
	);

	return columns;
};

export default useServiceSettingsTableColumns;
