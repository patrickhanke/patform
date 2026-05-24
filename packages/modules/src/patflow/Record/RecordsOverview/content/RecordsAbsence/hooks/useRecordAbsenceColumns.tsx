import { ColumnDef } from "@tanstack/react-table";
import { useMemo } from "react";
import { AbsenceWithRecordIs, UseRecordAbsenceColumnsProps } from "../types";
import { DisplayWorker, StateDisplay } from "@repo/ui";
import {
	absence_state_options,
	absence_type_options,
	getDateString
} from "@repo/provider";
import { EditRecordAbsence } from "../content";

const useRecordAbsenceColumns = ({ refetch }: UseRecordAbsenceColumnsProps) => {
	const columns: ColumnDef<AbsenceWithRecordIs>[] = useMemo(
		() => [
			{
				accessorFn: (row) => (
					<DisplayWorker workerId={row.user.objectId} />
				),
				header: () => <span>Nutzer</span>,
				id: "created_by",
				cell: (info) => info.getValue(),
				enableSorting: false,
				footer: (info) => info.column.id
			},
			{
				accessorFn: (row) =>
					`${getDateString(row.start_date).date} - ${getDateString(row.end_date).date}`,
				header: () => <span>Datum</span>,
				id: "date",
				cell: (info) => info.getValue(),
				enableSorting: false,
				footer: (info) => info.column.id
			},
			{
				accessorFn: (row) => {
					console.log({ row });
					return (
						<StateDisplay
							label={
								absence_type_options.find(
									(option) => option.value === row.type
								)?.label || ""
							}
							color={
								absence_type_options.find(
									(option) => option.value === row.type
								)?.color || ""
							}
						/>
					);
				},
				header: () => <span>Typ</span>,
				id: "type",
				cell: (info) => info.getValue(),
				enableSorting: false,
				footer: (info) => info.column.id
			},
			{
				accessorFn: (row) => (
					<StateDisplay
						label={
							absence_state_options.find(
								(option) => option.value === row.state
							)?.label || ""
						}
						color={
							absence_state_options.find(
								(option) => option.value === row.state
							)?.color || ""
						}
					/>
				),
				header: () => <span>Status</span>,
				id: "absence",
				cell: (info) => info.getValue(),
				enableSorting: false,
				footer: (info) => info.column.id
			},
			{
				accessorFn: (row) => row.comment,
				header: () => <span>Kommentar</span>,
				id: "comment",
				cell: (info) => info.getValue(),
				enableSorting: false,
				footer: (info) => info.column.id
			},
			{
				accessorFn: (row) => (
					<EditRecordAbsence absence={row} refetch={refetch} />
				),
				header: () => <span>Bearbeiten</span>,
				id: "edit",
				cell: (info) => info.getValue(),
				enableSorting: false,
				footer: (info) => info.column.id
			}
		],
		[]
	);

	return columns;
};

export default useRecordAbsenceColumns;
