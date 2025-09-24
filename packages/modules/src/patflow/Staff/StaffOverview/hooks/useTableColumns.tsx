import { ApolloRefetch, PatflowUser } from "@repo/types";
import { ColumnDef } from "@tanstack/react-table";
import { useMemo } from "react";
import StaffMemberSettings from "../content/StaffMemberSettings";
import { TableColumnEditColor } from "@repo/ui";
import { useDataHandler } from "@repo/provider";
import { StateDisplay } from "@repo/ui";

const useTableColumns = ({ refetch }: { refetch: ApolloRefetch }) => {
	const { updateData } = useDataHandler();
	const columns: ColumnDef<PatflowUser>[] = useMemo(
		() => [
			{
				accessorFn: (row) => `${row.first_name} ${row.last_name}`,
				header: () => <span>Name</span>,
				id: "name",
				cell: (info) => info.getValue(),
				footer: (info) => info.column.id,
				enableSorting: false
			},
			{
				accessorFn: (row) => (
					<StateDisplay
						label={row.role.name}
						color={row.role.color}
					/>
				),
				header: () => <span>Rolle</span>,
				id: "role",
				cell: (info) => info.getValue(),
				footer: (info) => info.column.id,
				enableSorting: false
			},
			{
				accessorFn: (row) => row.number,
				header: () => <span>Nummer</span>,
				id: "number",
				cell: (info) => info.getValue(),
				footer: (info) => info.column.id,
				enableSorting: false
			},
			{
				accessorFn: (row) => (
					<TableColumnEditColor
						value={row.color}
						onChange={async (value) => {
							await updateData({
								className: "_User",
								objectId: row.objectId,
								updateObject: {
									color: value
								}
							});
							refetch();
						}}
					/>
				),
				header: () => <span>Farbe</span>,
				id: "color",
				cell: (info) => info.getValue(),
				footer: (info) => info.column.id
			},
			{
				accessorFn: (row) => (
					<StaffMemberSettings userId={row.objectId} />
				),
				header: () => <span>Bearbeiten</span>,
				id: "edit",
				cell: (info) => info.getValue(),
				footer: (info) => info.column.id,
				enableSorting: false
			}
		],
		[]
	);

	return columns;
};

export default useTableColumns;
