import { useMemo } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Log, PatstoreUser } from "@repo/types";
import { LogData, LogType } from "../components";
import { TableColumnUser } from "@repo/ui";

const useLogColumns = () => {
	const columns: ColumnDef<Log>[] = useMemo(() => {
		const col: ColumnDef<Log>[] = [
			{
				accessorFn: (log) => <LogType type={log.type} />,
				header: () => <span>Typ</span>,
				id: "type",
				cell: (info) => info.getValue(),
				footer: (info) => info.column.id
			},
			{
				accessorFn: (log) => <p>{log.class}</p>,
				header: () => <span>Klasse</span>,
				id: "class",
				cell: (info) => info.getValue(),
				footer: (info) => info.column.id
			},
			{
				accessorFn: (log) => <p>{log.service}</p>,
				header: () => <span>Service</span>,
				id: "service",
				enableSorting: false,
				cell: (info) => info.getValue(),
				footer: (info) => info.column.id
			},
			{
				accessorFn: (log) => <p>{log.operation}</p>,
				header: () => <span>Operation</span>,
				id: "operation",
				enableSorting: false,
				cell: (info) => info.getValue(),
				footer: (info) => info.column.id
			},
			{
				accessorFn: (log) => <p>{log.message}</p>,
				header: () => <span>Nachricht</span>,
				id: "message",
				cell: (info) => info.getValue(),
				enableSorting: false,
				footer: (info) => info.column.id
			},
			{
				accessorFn: (log) => <p>{log.object_id}</p>,
				header: () => <span>Objekt ID</span>,
				id: "object_id",
				cell: (info) => info.getValue(),
				enableSorting: false,
				footer: (info) => info.column.id
			},
			{
				accessorFn: (log) => <LogData data={log.data} />,
				header: () => <span>Daten</span>,
				id: "data",
				cell: (info) => info.getValue(),
				footer: (info) => info.column.id
			},
			{
				accessorFn: (log) => {
					if (!log.user) {
						return null;
					}
					return <TableColumnUser value={log.user as PatstoreUser} />;
				},
				header: () => <span>Nutzer</span>,
				id: "user",
				cell: (info) => info.getValue(),
				footer: (info) => info.column.id
			}
		];

		return col;
	}, []);

	return columns;
};

export default useLogColumns;
