import { Holiday } from "@repo/types";
import { ColumnDef } from "@tanstack/react-table";
import { ReactNode, useMemo } from "react";
import { getDateString } from "@repo/provider";

const useHolidayColumns = () => {
	const columns: ColumnDef<Holiday>[] = useMemo(() => {
		const columnArray: ColumnDef<Holiday>[] = [
			{
				accessorFn: (row) => row.name,
				header: () => <span>Name</span>,
				id: "name",
				cell: (info) => info.getValue(),
				footer: (info) => info.column.id
			}
		];

		const year = new Date().getFullYear();

		for (let i = 0; i <= 4; i += 1) {
			columnArray.push({
				accessorFn: (row) => {
					const date = row?.dates?.find(
						(dt) => new Date(dt).getFullYear() === year + i
					);
					console.log({ date });
					return date ? getDateString(date).date : "-";
				},
				header: () => (
					<div style={{ textAlign: "right", width: "100%" }}>
						{year + i}
					</div>
				),

				id: (year + i).toString(),
				cell: (info) => (
					<div style={{ textAlign: "right" }}>
						{info.getValue() as ReactNode}
					</div>
				),
				footer: (info) => info.column.id
			});
		}

		return columnArray;
	}, []);

	return columns;
};

export default useHolidayColumns;
