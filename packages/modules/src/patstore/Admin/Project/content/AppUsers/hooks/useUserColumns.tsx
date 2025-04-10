import { useMemo, useCallback } from "react";
import { ColumnDef } from "@repo/ui";
import { PatstoreUser } from "@repo/types";
import { UseUserColumnsProps } from "../types";
import SelectUserRole from "../components/SelectUserRole";

const useUserColumns = ({ roles, refetch }: UseUserColumnsProps) => {
	const renderSelectUserRole = useCallback(
		(user: PatstoreUser) => {
			return (
				<SelectUserRole user={user} roles={roles} refetch={refetch} />
			);
		},
		[roles]
	);

	const columns: ColumnDef<PatstoreUser>[] = useMemo(
		() => [
			{
				accessorFn: (row) => row?.label,
				header: () => <span>Name</span>,
				id: "label",
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
				accessorFn: (row) => renderSelectUserRole(row),
				header: () => <span>Rolle</span>,
				id: "role",
				cell: (info) => info.getValue(),
				footer: (info) => info.column.id,
				enableSorting: false
			},
			{
				accessorFn: (row) => "edit",
				header: () => <span>Bearbeiten</span>,
				id: "edit",
				cell: (info) => info.getValue(),
				footer: (info) => info.column.id,
				enableSorting: false
			}
		],
		[roles]
	);

	return columns;
};

export default useUserColumns;
