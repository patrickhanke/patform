import { FC, useMemo } from "react";
import {
	ColumnDef,
	DisplayWorker,
	Divider,
	SlideIn,
	StateDisplay,
	Table
} from "@repo/ui";
import {
	absence_state_options,
	absence_type_options,
	getDateString,
	useFindData
} from "@repo/provider";
import { ShowAbsencesProps } from "../types";
import { Absence } from "@repo/types";

const ShowAbsences: FC<ShowAbsencesProps> = ({
	showAbsences,
	setShowAbsences,
	worker,
	year
}) => {
	const { data: absences } = useFindData({
		objectName: "Absence",
		fields: ["objectId", "start_date", "end_date", "type", "state"],
		filters: [{ key: "year", value: year, operator: "equalTo" }],
		userId: worker.objectId
	});

	console.log({ absences });

	const columns: ColumnDef<Absence>[] = useMemo(
		() => [
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
			}
		],
		[]
	);

	if (!absences || !worker) return null;

	return (
		<SlideIn
			isOpen={showAbsences}
			cancel={() => setShowAbsences(false)}
			confirm={() => setShowAbsences(false)}
			header="Abwesenheiten"
		>
			<div>
				<DisplayWorker workerId={worker.objectId} />
			</div>
			<Divider size="large" showLine />
			<Table
				columns={columns}
				data={absences.sort(
					(a, b) =>
						new Date(a.start_date).getTime() -
						new Date(b.start_date).getTime()
				)}
			/>
		</SlideIn>
	);
};

export default ShowAbsences;
