import { useMemo } from "react";
import { ColumnDef } from "@repo/ui";
import { PatstoreRoleClass } from "@repo/types";
import SelectRoleModules from "../components/SelectRoleModules";
import DefaultRole from "../components/DefaultRole";
import { UseRoleColumnsProps } from "../types";

const useRoleColumns = ({ modules, roles, refetch }: UseRoleColumnsProps) => {
	const columns: ColumnDef<PatstoreRoleClass>[] = useMemo(
		() => [
			{
				accessorFn: (row) => row?.name,
				header: () => <span>Name</span>,
				id: "label",
				cell: (info) => info.getValue(),
				footer: (info) => info.column.id,
				enableSorting: false
			},
			{
				accessorFn: (row) => (
					<SelectRoleModules
						initialModules={row.modules}
						modules={modules}
						roleId={row.objectId}
					/>
				),
				header: () => <span>Module</span>,
				id: "modules",
				cell: (info) => info.getValue(),
				footer: (info) => info.column.id,
				enableSorting: false
			},
			{
				accessorFn: (row) => (
					<DefaultRole
						roleId={row.objectId}
						roles={roles}
						refetch={refetch}
					/>
				),
				header: () => <span>Standard</span>,
				id: "default",
				cell: (info) => info.getValue(),
				footer: (info) => info.column.id,
				enableSorting: false
			}
		],
		[modules, roles, refetch]
	);

	return columns;
};

export default useRoleColumns;
