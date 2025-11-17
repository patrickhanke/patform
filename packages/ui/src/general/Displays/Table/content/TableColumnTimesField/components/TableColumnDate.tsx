import { IconButton } from "@repo/ui";
import "../styles.scss";
import { useMemo } from "react";
import { formatISO9075 } from "date-fns";
import { TableColumnTimeProps } from "../types";
import { weekdays } from "@repo/provider";

const TableColumnTime = ({
	time,
	setActiveTime,
	onDeleteTime
}: TableColumnTimeProps) => {
	const title = useMemo(() => {
		if (time.weekday) {
			const day = weekdays.find((day) => day.value === time.weekday);
			return day?.label || "Kein Wochentag";
		} else if (
			time.start &&
			time.start.length > 2 &&
			new Date(time.start)
		) {
			return formatISO9075(new Date(time.start));
		} else {
			return "Kein Datum";
		}
	}, [time]);

	return (
		<div className="table_column_time_container content_element">
			<div className="flex f-row a-ce gap-md">
				<h3>{title}</h3>
				<span>{`${time.start} - ${time.end}`}</span>
			</div>
			<div className="button_container">
				<IconButton
					icon="edit"
					onClick={() => setActiveTime(time.id)}
				/>
				<IconButton
					icon="delete"
					onClick={() => {
						onDeleteTime(time.id);
					}}
				/>
			</div>
		</div>
	);
};

export default TableColumnTime;
