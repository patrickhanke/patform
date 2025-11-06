import { CreateButton, SlideIn } from "@repo/ui";
import { TableColumnDatesFieldProps } from "./types";
import { useCallback, useMemo, useState } from "react";
import { EventDate } from "@repo/types";
import { useImmer } from "use-immer";
import TableColumnEditDate from "./components/TableColumnEditDate";
import TableColumnDate from "./components/TableColumnDate";
import { v4 } from "uuid";
import initialDateValues from "./constants/initialDateValues";
import { getDateString } from "@repo/provider";

const TableColumnDatesField = ({
	initialDates,
	onChange
}: TableColumnDatesFieldProps) => {
	const [loading, setLoading] = useState(false);
	const [editDates, setEditDates] = useState(false);
	const [dates, setDates] = useImmer<EventDate[]>(initialDates || []);
	const [activeDate, setActiveDate] = useState<EventDate["id"] | null>(null);

	console.log(initialDates);

	const slideInConfirmHandler = useCallback(async () => {
		setLoading(true);
		await onChange(dates);

		setEditDates(false);
		setLoading(false);
	}, [dates]);

	const findActiveDate = useCallback(
		(id: string | null) => {
			return dates.find((field) => field.id === id);
		},
		[dates]
	);

	const renderButtonText = useMemo(() => {
		if (dates && dates.length > 0) {
			return dates
				.map((date) => {
					let label = date.label ? `${date.label} / ` : "";
					if (date.start) {
						console.log(date.start);
						label += date.full_day
							? getDateString(new Date(date.start)).date
							: getDateString(new Date(date.start)).dateTime;

					console.log(getDateString(new Date(date.start)));
					}
					if (date.end) {
						label += date.full_day
							? ` - ${getDateString(new Date(date.end)).date}`
							: ` - ${getDateString(new Date(date.end)).dateTime}`;
					}

					console.log(label);

					return label;
				})
				.join(", ");
		} else {
			return "+ Termin hinzufügen";
		}
	}, [dates]);

	return (
		<>
			<div className="button_container">
				<button
					className="full_button sm light"
					onClick={() => setEditDates(!editDates)}
				>
					{renderButtonText}
				</button>
			</div>
			<SlideIn
				cancel={() => setEditDates(false)}
				confirm={() => slideInConfirmHandler()}
				isOpen={editDates}
				header="Felder bearbeiten"
				showSecondaryContent={!!activeDate}
				secondaryContent={
					<TableColumnEditDate
						date={findActiveDate(activeDate)}
						setDates={setDates}
					/>
				}
				disabled={[loading, loading]}
			>
				<div>
					<CreateButton
						text="Termin hinzufügen"
						size="small"
						onClick={() => {
							setDates((draft) => {
								draft.push({
									...initialDateValues,
									id: v4() as string
								});
							});
						}}
					/>
					<div className="table_columns_dates_list">
						{dates.map((date) => (
							<TableColumnDate
								key={date.id}
								date={date}
								setActiveDate={setActiveDate}
								onDelete={(id: string) => {
									setDates((draft) => {
										draft.splice(
											draft.findIndex(
												(field) => field.id === id
											),
											1
										);
									});
								}}
							/>
						))}
					</div>
				</div>
			</SlideIn>
		</>
	);
};

export default TableColumnDatesField;
