import { ColumnDef } from "@tanstack/react-table";
import { ReactNode, useContext, useMemo } from "react";
import {
	findDefaultTimeForDate,
	generateGraphQLQuery,
	getDateString,
	paramsHandler,
	UserContext
} from "@repo/provider";
import ColumnType from "../components/ColumnType";
import ColumnWorkingTime from "../components/ColumnWorkingTime";
import ColumnWorkingHours from "../components/ColumnWorkingHours";
import { ApolloRefetch, Record } from "@repo/types";
import EditDayTimes from "../../EditDayTimes";
import { DayData } from "../types";
import ColumnWorkingTarget from "../components/ColumnWorkingTarget";
import ColumnWorkingSaldo from "../components/ColumnWorkingSaldo";
import ColumnWorkingSurcharges from "../components/ColumnWorkingSurcharges";
import { useQuery } from "@apollo/client";

const useTableColumns = ({
	refetch,
	userId,
	records
}: {
	refetch: ApolloRefetch;
	userId: string;
	records: Record[];
}) => {
	const { projectId } = useContext(UserContext);
	const { data } = useQuery(
		generateGraphQLQuery({
			type: "find",
			objectName: "Surcharge",
			fields: ["objectId", "name", "color", "short", "description"]
		}),
		{
			variables: {
				params: paramsHandler({
					filters: [
						{
							key: "project",
							value: projectId,
							operator: "_eq",
							id: "projectId"
						}
					]
				})
			}
		}
	);

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
					<ColumnWorkingTime
						absence={row.absence}
						type={row.type}
						time={row.time}
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
				accessorFn: (row) => (
					<ColumnWorkingHours type={row.type} date={row} />
				),
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
				accessorFn: (row) => (
					<ColumnWorkingSaldo type={row.type} date={row} />
				),
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
						surcharges={
							data ? data.objects.findSurcharge.results : []
						}
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
						initialTime={
							findDefaultTimeForDate(row.date, records)
								.default_time ?? undefined
						}
						times={row.time || undefined}
						date={row.date}
						refetch={refetch}
						userId={userId}
						records={records}
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
		[userId, refetch, data]
	);

	return columns;
};

export default useTableColumns;
