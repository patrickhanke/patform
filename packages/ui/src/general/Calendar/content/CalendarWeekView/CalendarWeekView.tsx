"use client";

import { FC, useMemo } from "react";
import {
	eachDayOfInterval,
	endOfWeek,
	format,
	isToday,
	startOfWeek
} from "date-fns";
import type { CalendarViewRenderProps } from "../../types";
import CalendarTimeGrid from "../CalendarTimeGrid";

const CalendarWeekView: FC<CalendarViewRenderProps> = (props) => {
	const days = useMemo(() => {
		const start = startOfWeek(props.cursorDate, { weekStartsOn: 1 });
		const end = endOfWeek(props.cursorDate, { weekStartsOn: 1 });
		return eachDayOfInterval({ start, end });
	}, [props.cursorDate]);

	return (
		<div className="calendar_week_wrapper">
			<div className="calendar_weekday_row">
				<div
					className="calendar_weekday_cell"
					style={{ flex: "0 0 60px" }}
				/>
				{days.map((day) => (
					<div
						key={day.toISOString()}
						className="calendar_weekday_cell"
						data-is_today={isToday(day)}
					>
						{format(day, "EEE dd.MM")}
					</div>
				))}
			</div>
			<CalendarTimeGrid {...props} days={days} />
		</div>
	);
};

export default CalendarWeekView;
