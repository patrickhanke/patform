"use client";

import { FC, useMemo } from "react";
import { format, isToday } from "date-fns";
import type { CalendarViewRenderProps } from "../../types";
import CalendarTimeGrid from "../CalendarTimeGrid";

const CalendarDayView: FC<CalendarViewRenderProps> = (props) => {
	const days = useMemo(() => [props.cursorDate], [props.cursorDate]);

	return (
		<div className="calendar_day_wrapper">
			<div className="calendar_weekday_row">
				<div
					className="calendar_weekday_cell"
					style={{ flex: "0 0 60px" }}
				/>
				<div
					className="calendar_weekday_cell"
					data-is_today={isToday(props.cursorDate)}
				>
					{format(props.cursorDate, "EEEE, dd.MM.yyyy")}
				</div>
			</div>
			<CalendarTimeGrid {...props} days={days} />
		</div>
	);
};

export default CalendarDayView;
