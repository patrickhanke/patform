import { ColumnDef } from "@tanstack/react-table";
import { useMemo } from "react";
import EditStaffMember from "../components/EditStaffMember";
import SetStaffMemberPassword from "../components/SetStaffMemberPassword";
import { ApolloRefetch, PatflowUser } from "@repo/types";
import { StateDisplay, Toggle } from "@repo/ui";
import { useDataHandler } from "@repo/provider";

const useTableColumns = ({ refetch }: { refetch: ApolloRefetch }) => {
	const { updateData } = useDataHandler();

	const columns = useMemo<ColumnDef<PatflowUser>[]>(
		() => [
			{
				accessorFn: (row) => `${row.first_name} ${row.family_name}`,
				header: () => <span>Name</span>,
				id: "name",
				cell: (info) => info.getValue(),
				footer: (info) => info.column.id,
				enableSorting: false
			},
			{
				accessorFn: (row) => (
					<StateDisplay
						label={row.role?.name || "Keine Rolle"}
						color={row.role?.color || "black"}
					/>
				),
				header: () => <span>Rolle</span>,
				id: "role",
				cell: (info) => info.getValue(),
				footer: (info) => info.column.id,
				enableSorting: false
			},
			{
				accessorFn: (row) => (
					<Toggle
						onClick={async () => {
							await updateData({
								className: "_User",
								objectId: row.objectId,
								updateObject: {
									is_worker: !row.is_worker
								}
							});

							await refetch();
						}}
						value={row.is_worker}
					/>
				),
				header: () => <span>Arbeiter</span>,
				id: "worker",
				cell: (info) => info.getValue(),
				footer: (info) => info.column.id,
				enableSorting: false
			},
			{
				accessorFn: (row) => (
					<div className="button_container">
						<SetStaffMemberPassword userId={row.objectId} />
						<EditStaffMember userId={row.objectId} />
					</div>
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
