import { ColumnDef } from "@tanstack/react-table";
import { useMemo } from "react";
import EditStaffMember from "../components/EditStaffMember";
import SetStaffMemberPassword from "../components/SetStaffMemberPassword";
import { ApolloRefetch, PatflowUser, PatstoreUserRole } from "@repo/types";
import { StateDisplay, Toggle } from "@repo/ui";
import { useDataHandlerSecure } from "@repo/provider";

const useTableColumns = ({
	refetch,
	roles
}: {
	refetch: ApolloRefetch;
	roles: PatstoreUserRole[];
}) => {
	const { updateData } = useDataHandlerSecure(true);

	const columns = useMemo<ColumnDef<PatflowUser>[]>(
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
				accessorFn: (row) => {
					const userRole: PatstoreUserRole | undefined = roles.find(
						(role) => row.roles.includes(role.objectId)
					);
					let label = "Keine Rolle";
					let color = "black";

					if (userRole) {
						label = userRole.name;
						color = userRole.color;
					}
					return <StateDisplay label={label} color={color} />;
				},
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
								className: "User",
								objectId: row.objectId,
								updateObject: {
									is_worker: !row.settings.is_worker
								}
							});

							await refetch();
						}}
						value={row.settings.is_worker}
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
