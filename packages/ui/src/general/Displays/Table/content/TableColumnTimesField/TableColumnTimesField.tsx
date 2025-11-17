import { CreateButton, SlideIn } from "@repo/ui";
import { useCallback, useState } from "react";
import { EventTime } from "@repo/types";
import { useImmer } from "use-immer";
import { v4 } from "uuid";
import { TableColumnTimesFieldProps } from "./types";
import initialTimeValues from "./constants/initialDateValues";
import TableColumnTime from "./components/TableColumnDate";
import TableColumnEditTime from "./components/TableColumnEditDate";
import { getWeekday } from "@repo/provider";

const TableColumnTimesField = ({
	initialTimes,
	onChange
}: TableColumnTimesFieldProps) => {
	const [loading, setLoading] = useState(false);
	const [editDates, setEditDates] = useState(false);
	const [times, setTimes] = useImmer<EventTime[]>(initialTimes || []);
	const [activeDate, setActiveTime] = useState<EventTime["id"] | null>(null);

	console.log(initialTimes);

	const slideInConfirmHandler = useCallback(async () => {
		setLoading(true);
		await onChange(times);

		setEditDates(false);
		setLoading(false);
	}, [times]);

	const findActiveTime = useCallback(
		(id: string | null) => {
			return times.find((field) => field.id === id);
		},
		[times]
	);

	return (
		<>
			<div>
				{times && times.length > 0 ? (
					<button
						type="button"
						className="full_button sm light"
						onClick={() => setEditDates(!editDates)}
					>
						{times.length > 2 ? (
							<div>{times.length} Zeiten</div>
						) : (
							times.map((time) => (
								<div key={`${time.id}_${time.start}`}>
									{`${getWeekday(time.weekday)?.short} - ${time.start}-${time.end}`}
								</div>
							))
						)}
					</button>
				) : (
					<button
						type="button"
						className="full_button sm grey"
						onClick={() => setEditDates(!editDates)}
					>
						+ Zeiten hinzufügen
					</button>
				)}
			</div>
			<SlideIn
				cancel={() => {
					setTimes(initialTimes || []);
					setEditDates(false);
				}}
				confirm={() => slideInConfirmHandler()}
				isOpen={editDates}
				header="Felder bearbeiten"
				showSecondaryContent={!!activeDate}
				secondaryContent={
					<TableColumnEditTime
						time={findActiveTime(activeDate)}
						setTimes={setTimes}
					/>
				}
				disabled={[loading, loading]}
			>
				<div>
					<CreateButton
						text="Zeit hinzufügen"
						size="small"
						onClick={() => {
							setTimes((draft) => {
								draft.push({
									...initialTimeValues,
									id: v4() as string
								});
							});
						}}
					/>
					<div className="table_columns_times_list">
						{times.map((time) => (
							<TableColumnTime
								key={time.id}
								time={time}
								setActiveTime={setActiveTime}
								onDeleteTime={(id: string) => {
									setTimes((draft) => {
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

export default TableColumnTimesField;
