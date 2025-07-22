import { useMemo } from "react";
import { ColumnDef, TableColumnString } from "@repo/ui";
import { ApolloRefetch, PatstoreUser } from "@repo/types";
import { useDataHandler } from "@repo/provider";
import UserRole from "../components/UserRole";
import DeleteUser from "../components/DeleteUser";

const useUserColumns = ({ refetch }: { refetch: ApolloRefetch }) => {
	const { updateData } = useDataHandler();
	const columns: ColumnDef<PatstoreUser>[] = useMemo(
		() => [
			{
				accessorFn: (row) => (
					<TableColumnString
						value={row.name}
						onChange={(value) => {
							updateData({
								className: "_User",
								objectId: row.objectId,
								updateObject: {
									name: value
								}
							});
						}}
						isEditable
					/>
				),
				header: () => <span>Name</span>,
				id: "name",
				cell: (info) => info.getValue(),
				footer: (info) => info.column.id,
				enableSorting: false
			},
			{
				accessorFn: (row) => row?.username,
				header: () => <span>E-Mail</span>,
				id: "username",
				cell: (info) => info.getValue(),
				footer: (info) => info.column.id,
				enableSorting: false
			},
			{
				accessorFn: (row) => <UserRole user={row} refetch={refetch} />,
				header: () => <span>Rolle</span>,
				id: "role",
				cell: (info) => info.getValue(),
				footer: (info) => info.column.id,
				enableSorting: false
			},
			{
				accessorFn: (row) => (
					<DeleteUser
						userId={row.objectId}
						username={row.name}
						email={row.username}
						refetch={refetch}
					/>
				),
				header: () => <span>Löschen</span>,
				id: "delete",
				cell: (info) => info.getValue(),
				footer: (info) => info.column.id,
				enableSorting: false
			}
		],
		[]
	);

	return columns;
};

export default useUserColumns;
