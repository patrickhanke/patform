import { useMemo } from "react";
import { ColumnDef } from "@repo/ui";
import { PatstoreUser } from "@repo/types";
import { UseUserColumnsProps } from "../types";
import SelectUserRole from "../components/SelectUserRole";

const useUserColumns = ({ roles }: UseUserColumnsProps) => {
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
				accessorFn: (row) => (
					<SelectUserRole userId={row.objectId} roles={roles} />
				),
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

    console.log(roles);
    

	return columns;
};

export default useUserColumns;
