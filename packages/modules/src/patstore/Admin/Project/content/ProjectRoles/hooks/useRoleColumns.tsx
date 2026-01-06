import { useMemo } from "react";
import { ColumnDef, TableColumnEditColor, TableColumnString } from "@repo/ui";
import { PatstoreRoleClass } from "@repo/types";
import SelectRoleModules from "../components/SelectRoleModules";
import DefaultRole from "../components/DefaultRole";
import { UseRoleColumnsProps } from "../types";
import { useDataHandler } from "@repo/provider";
import AdminRole from "../components/AdminRole";

const useRoleColumns = ({
	modules,
	roles,
	refetch,
	projectId
}: UseRoleColumnsProps) => {
	const { updateData } = useDataHandler(true);

	const columns: ColumnDef<PatstoreRoleClass>[] = useMemo(
		() => [
			{
				accessorFn: (row) => (
					<TableColumnString
						isEditable
						value={row.title}
						onChange={async (value) => {
							await updateData({
								className: "_Role",
								objectId: row.objectId,
								updateObject: {
									title: value
								}
							});
							await refetch();
						}}
					/>
				),
				header: () => <span>Titel</span>,
				id: "title",
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
					<TableColumnEditColor
						value={row.color || "blue"}
						onChange={async (color) => {
							await updateData({
								className: "_Role",
								objectId: row.objectId,
								updateObject: {
									color: color
								}
							});
							await refetch();
						}}
					/>
				),
				header: () => <span>Farbe</span>,
				id: "color",
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
			},
			{
				accessorFn: (row) => (
					<AdminRole
						roleId={row.objectId}
						roles={roles}
						refetch={refetch}
						projectId={projectId}
					/>
				),
				header: () => <span>Admin</span>,
				id: "admin",
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
