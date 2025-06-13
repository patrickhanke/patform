import { ColumnDef } from "@tanstack/react-table";
import { useMemo } from "react";
import { getDateString } from "@repo/provider";
import { DayData } from "../types";
import ColumnType from "../components/ColumnType";
import ColumnWorkingTime from "../components/ColumnWorkingTime";
import ColumnWorkingHours from "../components/ColumnWorkingHours";
import { ApolloRefetch } from "@repo/types";
import EditDayTimes from "../content/EditDayTimes";

const useTableColumns = ({
	refetch,
	userId
}: {
	refetch: ApolloRefetch;
	userId: string;
}) => {
	const columns: ColumnDef<DayData>[] = useMemo(
		() => [
			{
				accessorFn: (row) => getDateString(row.date).date,
				header: () => <span>Datum</span>,
				id: "date",
				cell: (info) => info.getValue(),
				footer: (info) => info.column.id,
				enableSorting: false
			},
			{
				accessorFn: (row) => (
					<ColumnType
						type={row.type}
						absenceType={row.absence?.type}
					/>
				),
				header: () => <span>Typ</span>,
				id: "type",
				cell: (info) => info.getValue(),
				footer: (info) => info.column.id,
				enableSorting: false
			},
			{
				accessorFn: (row) => (
					<ColumnWorkingTime
						type={row.type}
						time={row.time}
						date={row.date}
						refetch={refetch}
						userId={userId}
					/>
				),
				header: () => <span>Arbeitszeiten</span>,
				id: "working_times",
				cell: (info) => info.getValue(),
				footer: (info) => info.column.id,
				enableSorting: false
			},
			{
				accessorFn: (row) => (
					<ColumnWorkingHours type={row.type} date={row} />
				),
				header: () => <span>Stunden (Brutto)</span>,
				id: "amount",
				cell: (info) => info.getValue(),
				footer: (info) => info.column.id,
				enableSorting: false
			},
			{
				accessorFn: (row) =>
					row.type !== "absence" ? (
						<EditDayTimes
							type="create"
							date={row.date}
							refetch={refetch}
							userId={userId}
						/>
					) : (
						<span>-</span>
					),
				header: () => <span>Zeit hinzufügen</span>,
				id: "edit",
				cell: (info) => info.getValue(),
				enableSorting: false,
				footer: (info) => info.column.id
			}
		],
		[userId, refetch]
	);

	return columns;
};

export default useTableColumns;
