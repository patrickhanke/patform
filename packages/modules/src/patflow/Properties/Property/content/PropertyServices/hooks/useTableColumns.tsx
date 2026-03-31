import { PropertyService } from "@repo/types";
import { ColumnDef } from "@tanstack/react-table";
import {
	DateSelectInterface,
	StatelessToggle,
	TeamAssignment,
	WorkersInterface
} from "@repo/ui";
import { useMemo } from "react";
import { PropertyServiceChangeHandler } from "../types";

const useTableColumns = ({
	serviceChangeHandler
}: {
	serviceChangeHandler: PropertyServiceChangeHandler;
}) => {
	const columns = useMemo(
		() => [
			{
				accessorFn: (row) => row.name,
				header: () => "Name",
				id: "name",
				cell: (info) => info.getValue(),
				footer: (info) => info.column.id
			},
			{
				accessorFn: (row) => (
					<DateSelectInterface
						onChange={(value) =>
							serviceChangeHandler(row.id, "time", value)
						}
					/>
				),
				header: () => "Zeiten",
				id: "time",
				cell: (info) => info.getValue(),
				footer: (info) => info.column.id
			},
			{
				accessorFn: (row) => (
					<TeamAssignment
						workers={row.assigned_staff}
						onChange={(value: string[]) => {
							serviceChangeHandler(
								row.id,
								"assigned_staff",
								value
							);
						}}
					/>
				),
				header: () => "Arbeiter",
				id: "workers",
				cell: (info) => info.getValue(),
				footer: (info) => info.column.id
			},
			{
				accessorFn: (row) => (
					<StatelessToggle
						value={row.active}
						onChange={(value: boolean) => {
							serviceChangeHandler(row.id, "active", value);
						}}
					/>
				),
				header: () => "Aktiv",
				id: "active",
				cell: (info) => info.getValue(),
				footer: (info) => info.column.id
			}
		],
		[]
	) as ColumnDef<PropertyService>[];

	return columns;
};

export default useTableColumns;
