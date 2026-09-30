import { CreateButton, SlideIn } from "@repo/ui";
import { useCallback, useState } from "react";
import { EventTime, ModuleFieldTimesSettings } from "@repo/types";
import { useImmer } from "use-immer";
import { v4 } from "uuid";
import { TableColumnTimesFieldProps } from "./types";
import TableColumnTime from "./components/TableColumnDate";
import TableColumnEditTime from "./components/TableColumnEditDate";
import { getWeekday } from "@repo/provider";

const getDefaultPlace = (
	settings?: ModuleFieldTimesSettings
): EventTime["place"] => {
	const defaultPlace: EventTime["place"] = {
		type: "map",
		address: "",
		map: {
			latitude: 0,
			longitude: 0
		},
		online: ""
	};
	if (settings?.select_address) defaultPlace.type = "address";
	if (settings?.select_location) defaultPlace.type = "location";
	if (settings?.select_map) defaultPlace.type = "map";
	if (settings?.select_online) defaultPlace.type = "online";
	return defaultPlace;
};

const TableColumnTimesField = ({
	initialTimes,
	onChange,
	settings
}: TableColumnTimesFieldProps) => {
	const [loading, setLoading] = useState(false);
	const [editDates, setEditDates] = useState(false);
	const [times, setTimes] = useImmer<EventTime[]>(initialTimes || []);
	const [activeDate, setActiveTime] = useState<EventTime["id"] | null>(null);

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
						settings={settings}
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
									start: "",
									end: "",
									weekday: "",
									place: getDefaultPlace(settings),
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
