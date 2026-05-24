import { ColumnDef, Row } from "@tanstack/react-table";
import { ReactNode, useCallback, useContext, useMemo } from "react";
import {
	findDefaultTimeForDate,
	getDateString,
	useFindData,
	UserContext
} from "@repo/provider";
import ColumnWorkingTime from "../components/ColumnWorkingTime";
import ColumnWorkingHours from "../components/ColumnWorkingHours";
import { ApolloRefetch, Day, Holiday, Record } from "@repo/types";
import EditDayTimes from "../../EditDayTimes";
import { DayData } from "../types";
import ColumnWorkingTarget from "../components/ColumnWorkingTarget";
import ColumnWorkingSaldo from "../components/ColumnWorkingSaldo";
import ColumnWorkingSurcharges from "../components/ColumnWorkingSurcharges";
import { Tooltip } from "@repo/ui";
import { Button } from "@chakra-ui/react";
import { LuInfo } from "react-icons/lu";

const useTableColumns = ({
	refetch,
	userId,
	records,
	holidays,
	days
}: {
	refetch: ApolloRefetch;
	userId: string;
	records: Record[];
	holidays: Holiday[];
	days: Day[];
}) => {
	const { projectId } = useContext(UserContext);
	const { data } = useFindData({
		objectName: "Surcharge",
		fields: ["objectId", "name", "color", "short", "description"],
		projectId: projectId,
		skipQuery: !projectId
	});

	const secondaryRow = useCallback((row: Row<DayData>) => {
		const text = row.original.comment?.trim();
		if (!text) return null;
		return (
			<div
				style={{
					paddingTop: 6,
					paddingBottom: 6,
					fontSize: "9px",
					color: "#4a5568",
					lineHeight: 1
				}}
			>
				<span style={{ fontWeight: "bold" }}>Kommentar:</span> {text}
			</div>
		);
	}, []);

	const columns: ColumnDef<DayData>[] = useMemo(
		() => [
			{
				accessorFn: (row) => {
					const holiday = holidays.find((holiday) =>
						holiday.dates.includes(row?.date)
					);

					return (
						<div>
							{getDateString(row.date).date}
							{holiday && (
								<Tooltip content={holiday.name}>
									<Button size="2xs" variant="ghost">
										<LuInfo />
									</Button>
								</Tooltip>
							)}
						</div>
					);
				},
				header: () => <span>Datum</span>,
				id: "date",
				cell: (info) => info.getValue(),
				footer: (info) => info.column.id,
				enableSorting: false
			},
			{
				accessorFn: (row) => (
					<ColumnWorkingTime
						isWorkingDay={row.is_working_day}
						days={days || []}
						times={row.times || []}
						date={row.date}
						refetch={refetch}
						userId={userId}
						records={records}
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
					<ColumnWorkingTarget
						date={row}
						isWorkingDay={row.is_working_day}
					/>
				),
				id: "target",
				header: () => <div style={{ textAlign: "right" }}>Soll</div>,
				cell: (info) => (
					<div style={{ textAlign: "right" }}>
						{info?.getValue() as ReactNode}
					</div>
				),
				footer: (info) => info.column.id,
				enableSorting: false
			},
			{
				accessorFn: (row) => <ColumnWorkingHours times={row.times} />,
				id: "is",
				header: () => <div style={{ textAlign: "right" }}>Ist</div>,
				cell: (info) => (
					<div style={{ textAlign: "right" }}>
						{info?.getValue() as ReactNode}
					</div>
				),
				footer: (info) => info.column.id,
				enableSorting: false
			},
			{
				accessorFn: (row) => <ColumnWorkingSaldo date={row} />,
				id: "saldo",
				header: () => <div style={{ textAlign: "right" }}>Saldo</div>,
				cell: (info) => (
					<div style={{ textAlign: "right" }}>
						{info?.getValue() as ReactNode}
					</div>
				),
				footer: (info) => info.column.id,
				enableSorting: false
			},
			{
				accessorFn: (row) => (
					<ColumnWorkingSurcharges
						surcharges={data ? data : []}
						daySurcharges={row.surcharges}
					/>
				),
				id: "surcharges",
				header: () => (
					<div style={{ textAlign: "right" }}>Zuschläge</div>
				),
				cell: (info) => (
					<div style={{ textAlign: "right" }}>
						{info?.getValue() as ReactNode}
					</div>
				),
				footer: (info) => info.column.id,
				enableSorting: false
			},
			{
				accessorFn: (row) => (
					<EditDayTimes
						type="create"
						isWorkingDay={row.is_working_day}
						initialTime={
							findDefaultTimeForDate(row.date, records)
								.default_time ?? undefined
						}
						times={row.times || undefined}
						date={row.date}
						refetch={refetch}
						userId={userId}
						records={records}
						days={days}
					/>
				),
				header: () => (
					<div style={{ textAlign: "right" }}>Zeit hinzufügen</div>
				),
				cell: (info) => info.getValue(),
				id: "edit",
				enableSorting: false,
				footer: (info) => info.column.id
			}
		],
		[userId, refetch, data, holidays, records]
	);

	return { columns, secondaryRow };
};

export default useTableColumns;
